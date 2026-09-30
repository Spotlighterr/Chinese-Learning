import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export type Progress = {
  completedSentenceIds: string[]
  savedWordIds: string[]
  attemptsCount: number
  bestBySentence: Record<string, { correct: number; extra: number; total: number }>
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
      return { completedSentenceIds, savedWordIds, attemptsCount: attemptRows.length, bestBySentence }
    },
    setWord(sessionId: string, wordId: string, saved: boolean) {
      if (saved) db.prepare('INSERT OR IGNORE INTO saved_words (session_id, word_id) VALUES (?, ?)').run(sessionId, wordId)
      else db.prepare('DELETE FROM saved_words WHERE session_id = ? AND word_id = ?').run(sessionId, wordId)
    },
    completeSentence(sessionId: string, sentenceId: string) {
      db.prepare('INSERT OR IGNORE INTO completed_sentences (session_id, sentence_id) VALUES (?, ?)').run(sessionId, sentenceId)
    },
    addAttempt(sessionId: string, sentenceId: string, correct: number, extra: number, total: number) {
      db.prepare('INSERT INTO segmentation_attempts (session_id, sentence_id, correct, extra, total) VALUES (?, ?, ?, ?, ?)')
        .run(sessionId, sentenceId, correct, extra, total)
    },
    close() { db.close() },
  }
}

export type Store = ReturnType<typeof createStore>
