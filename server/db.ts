import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { lessons } from '../src/data/lessons.ts'
import { scheduleReview, type ReviewRating } from './review.ts'

export type LearningProfile = {
  level: 'new' | 'basic' | 'intermediate'
  targetHsk: number
  targetDate: string
  dailyMinutes: number
  handwriting: boolean
  explanationLocale: 'vi-VN' | 'en-US'
}

export type Progress = {
  completedSentenceIds: string[]
  savedWordIds: string[]
  attemptsCount: number
  bestBySentence: Record<string, { correct: number; extra: number; total: number }>
  profile: LearningProfile | null
  completedLessonIds: string[]
  passedExerciseIdsByLesson: Record<string, string[]>
  exerciseAttemptsCount: number
  dueReviewCount: number
}

export function createStore(path: string) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;
    CREATE TABLE IF NOT EXISTS saved_words (
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      word_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (session_id, word_id)
    ) STRICT;
    CREATE TABLE IF NOT EXISTS completed_sentences (
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      sentence_id TEXT NOT NULL,
      completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (session_id, sentence_id)
    ) STRICT;
    CREATE TABLE IF NOT EXISTS segmentation_attempts (
      id INTEGER PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      sentence_id TEXT NOT NULL,
      correct INTEGER NOT NULL CHECK (correct >= 0),
      extra INTEGER NOT NULL CHECK (extra >= 0),
      total INTEGER NOT NULL CHECK (total >= 0),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;
    CREATE TABLE IF NOT EXISTS learning_profiles (
      session_id TEXT PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
      level TEXT NOT NULL,
      target_hsk INTEGER NOT NULL,
      target_date TEXT NOT NULL,
      daily_minutes INTEGER NOT NULL,
      handwriting INTEGER NOT NULL,
      explanation_locale TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;
    CREATE TABLE IF NOT EXISTS exercise_attempts (
      id INTEGER PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      correct INTEGER NOT NULL CHECK (correct IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;
    CREATE TABLE IF NOT EXISTS completed_lessons (
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL,
      completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (session_id, lesson_id)
    ) STRICT;
    CREATE TABLE IF NOT EXISTS review_items (
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      word_id TEXT NOT NULL,
      repetitions INTEGER NOT NULL DEFAULT 0,
      interval_days INTEGER NOT NULL DEFAULT 0,
      ease REAL NOT NULL DEFAULT 2.5,
      due_at INTEGER NOT NULL,
      PRIMARY KEY (session_id, word_id)
    ) STRICT;
  `)

  return {
    hasSession(id: string) {
      return Boolean(db.prepare('SELECT 1 FROM sessions WHERE id = ?').get(id))
    },
    createSession(id: string) {
      db.prepare('INSERT INTO sessions (id) VALUES (?)').run(id)
    },
    progress(sessionId: string): Progress {
      const completedSentenceIds = db.prepare('SELECT sentence_id FROM completed_sentences WHERE session_id = ?').all(sessionId)
        .map((row) => String(row.sentence_id))
      const savedWordIds = db.prepare('SELECT word_id FROM saved_words WHERE session_id = ?').all(sessionId)
        .map((row) => String(row.word_id))
      const attemptRows = db.prepare('SELECT sentence_id, correct, extra, total FROM segmentation_attempts WHERE session_id = ?').all(sessionId)
      const bestBySentence: Progress['bestBySentence'] = {}
      for (const row of attemptRows) {
        const sentenceId = String(row.sentence_id)
        const candidate = { correct: Number(row.correct), extra: Number(row.extra), total: Number(row.total) }
        const previous = bestBySentence[sentenceId]
        if (!previous || candidate.correct - candidate.extra > previous.correct - previous.extra) {
          bestBySentence[sentenceId] = candidate
        }
      }
      const passedExerciseIdsByLesson: Progress['passedExerciseIdsByLesson'] = {}
      const passedRows = db.prepare('SELECT DISTINCT lesson_id, exercise_id FROM exercise_attempts WHERE session_id = ? AND correct = 1').all(sessionId)
      for (const row of passedRows) {
        const lessonId = String(row.lesson_id)
        ;(passedExerciseIdsByLesson[lessonId] ??= []).push(String(row.exercise_id))
      }
      const completedLessonIds = lessons.filter((lesson) => {
        const passed = new Set(passedExerciseIdsByLesson[lesson.id] ?? [])
        return lesson.exercises.every((exercise) => passed.has(exercise.id))
      }).map((lesson) => lesson.id)
      const exerciseAttemptsCount = Number(db.prepare('SELECT COUNT(*) AS count FROM exercise_attempts WHERE session_id = ?').get(sessionId)?.count ?? 0)
      const dueReviewCount = Number(db.prepare('SELECT COUNT(*) AS count FROM review_items WHERE session_id = ? AND due_at <= ?').get(sessionId, Date.now())?.count ?? 0)
      return { completedSentenceIds, savedWordIds, attemptsCount: attemptRows.length, bestBySentence, profile: this.profile(sessionId), completedLessonIds, passedExerciseIdsByLesson, exerciseAttemptsCount, dueReviewCount }
    },
    profile(sessionId: string): LearningProfile | null {
      const row = db.prepare('SELECT level, target_hsk, target_date, daily_minutes, handwriting, explanation_locale FROM learning_profiles WHERE session_id = ?').get(sessionId)
      if (!row) return null
      return { level: String(row.level) as LearningProfile['level'], targetHsk: Number(row.target_hsk), targetDate: String(row.target_date), dailyMinutes: Number(row.daily_minutes), handwriting: Boolean(row.handwriting), explanationLocale: String(row.explanation_locale) as LearningProfile['explanationLocale'] }
    },
    saveProfile(sessionId: string, profile: LearningProfile) {
      db.prepare(`INSERT INTO learning_profiles (session_id, level, target_hsk, target_date, daily_minutes, handwriting, explanation_locale)
        VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(session_id) DO UPDATE SET level=excluded.level, target_hsk=excluded.target_hsk,
        target_date=excluded.target_date, daily_minutes=excluded.daily_minutes, handwriting=excluded.handwriting,
        explanation_locale=excluded.explanation_locale, updated_at=CURRENT_TIMESTAMP`)
        .run(sessionId, profile.level, profile.targetHsk, profile.targetDate, profile.dailyMinutes, Number(profile.handwriting), profile.explanationLocale)
    },
    setWord(sessionId: string, wordId: string, saved: boolean) {
      if (saved) {
        db.prepare('INSERT OR IGNORE INTO saved_words (session_id, word_id) VALUES (?, ?)').run(sessionId, wordId)
        db.prepare('INSERT OR IGNORE INTO review_items (session_id, word_id, due_at) VALUES (?, ?, ?)').run(sessionId, wordId, Date.now())
      } else {
        db.prepare('DELETE FROM review_items WHERE session_id = ? AND word_id = ?').run(sessionId, wordId)
        db.prepare('DELETE FROM saved_words WHERE session_id = ? AND word_id = ?').run(sessionId, wordId)
      }
    },
    completeSentence(sessionId: string, sentenceId: string) {
      db.prepare('INSERT OR IGNORE INTO completed_sentences (session_id, sentence_id) VALUES (?, ?)').run(sessionId, sentenceId)
    },
    addAttempt(sessionId: string, sentenceId: string, correct: number, extra: number, total: number) {
      db.prepare('INSERT INTO segmentation_attempts (session_id, sentence_id, correct, extra, total) VALUES (?, ?, ?, ?, ?)')
        .run(sessionId, sentenceId, correct, extra, total)
    },
    addExerciseAttempt(sessionId: string, lessonId: string, exerciseId: string, correct: boolean, exerciseCount: number) {
      db.prepare('INSERT INTO exercise_attempts (session_id, lesson_id, exercise_id, correct) VALUES (?, ?, ?, ?)')
        .run(sessionId, lessonId, exerciseId, Number(correct))
      const passed = Number(db.prepare('SELECT COUNT(DISTINCT exercise_id) AS count FROM exercise_attempts WHERE session_id = ? AND lesson_id = ? AND correct = 1').get(sessionId, lessonId)?.count ?? 0)
      if (passed >= exerciseCount) db.prepare('INSERT OR IGNORE INTO completed_lessons (session_id, lesson_id) VALUES (?, ?)').run(sessionId, lessonId)
    },
    dueWordIds(sessionId: string) {
      return db.prepare('SELECT word_id FROM review_items WHERE session_id = ? AND due_at <= ? ORDER BY due_at ASC').all(sessionId, Date.now())
        .map((row) => String(row.word_id))
    },
    rateReview(sessionId: string, wordId: string, rating: ReviewRating) {
      const row = db.prepare('SELECT repetitions, interval_days, ease, due_at FROM review_items WHERE session_id = ? AND word_id = ?').get(sessionId, wordId)
      if (!row || Number(row.due_at) > Date.now()) return false
      const next = scheduleReview({ repetitions: Number(row.repetitions), intervalDays: Number(row.interval_days), ease: Number(row.ease), dueAt: Number(row.due_at) }, rating)
      db.prepare('UPDATE review_items SET repetitions = ?, interval_days = ?, ease = ?, due_at = ? WHERE session_id = ? AND word_id = ?')
        .run(next.repetitions, next.intervalDays, next.ease, next.dueAt, sessionId, wordId)
      return true
    },
    close() { db.close() },
  }
}

export type Store = ReturnType<typeof createStore>
