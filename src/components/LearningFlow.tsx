import { useEffect, useState } from 'react'
import { progressApi, type LearningProfile, type Progress } from '../api/progress'
import { sentences, words, type Locale } from '../data/curriculum'
import { lessons } from '../data/lessons'
import { lt } from '../learning-i18n'

type View = 'today' | 'review' | 'profile'
type Props = { locale: Locale; progress: Progress; onProgress: (value: Progress) => void; onLocale: (value: Locale) => void }

export function LearningFlow({ locale, progress, onProgress, onLocale }: Props) {
  const [view, setView] = useState<View>(progress.profile ? 'today' : 'profile')
  const [profile, setProfile] = useState<LearningProfile>(progress.profile ?? {
    level: 'new', targetHsk: 1, targetDate: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
    dailyMinutes: 30, handwriting: false, explanationLocale: locale,
  })
  const [lessonIndex, setLessonIndex] = useState(0)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [order, setOrder] = useState<string[]>([])
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const [due, setDue] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lesson = lessons[lessonIndex]
  const exercise = lesson.exercises[exerciseIndex]
  const reviewWord = words[due[0]]

  useEffect(() => {
    if (view !== 'review') return
    let active = true
    progressApi.dueReviews().then((result) => { if (active) { setDue(result.wordIds); setError('') } })
      .catch(() => { if (active) setError(lt(locale, 'saveError')) })
    return () => { active = false }
  }, [view, progress.dueReviewCount, locale])

  async function saveProfile() {
    if (profile.targetDate <= new Date().toISOString().slice(0, 10)) { setError(lt(locale, 'dateError')); return }
    setBusy(true); setError('')
    try {
      onProgress(await progressApi.saveProfile(profile))
      onLocale(profile.explanationLocale)
      setView('today')
    } catch { setError(lt(locale, 'saveError')) }
    finally { setBusy(false) }
  }

  async function checkExercise() {
    if (exercise.kind === 'choice' && choice === null) return
    if (exercise.kind === 'order' && order.length !== exercise.wordIds.length) return
    const answer = exercise.kind === 'choice' ? choice! : order
    setBusy(true); setError('')
    try {
      const result = await progressApi.answerExercise(lesson.id, exercise.id, answer)
      onProgress(result.progress); setFeedback(result.correct)
    } catch { setError(lt(locale, 'saveError')) }
    finally { setBusy(false) }
  }

  async function rate(rating: 'again' | 'good') {
    setBusy(true); setError('')
    try {
      const result = await progressApi.rateReview(due[0], rating)
      onProgress(result.progress); setDue(result.wordIds); setRevealed(false)
    } catch { setError(lt(locale, 'saveError')) }
    finally { setBusy(false) }
  }

  function nextExercise() {
    setChoice(null); setOrder([]); setFeedback(null)
    if (exerciseIndex + 1 < lesson.exercises.length) setExerciseIndex(exerciseIndex + 1)
    else if (lessonIndex + 1 < lessons.length) { setLessonIndex(lessonIndex + 1); setExerciseIndex(0) }
    else { setLessonIndex(0); setExerciseIndex(0) }
  }

  return <section className="learning-flow" aria-label={lt(locale, 'today')}>
    <div className="learning-stats" aria-label={lt(locale, 'lessonProgress')}>
      <div><span>{lt(locale, 'sentencesProgress')}</span><strong>{progress.completedSentenceIds.length}/{sentences.length}</strong><progress max={sentences.length} value={progress.completedSentenceIds.length} /></div>
      <div><span>{lt(locale, 'exercisesProgress')}</span><strong>{progress.completedLessonIds.length}/{lessons.length}</strong><progress max={lessons.length} value={progress.completedLessonIds.length} /></div>
      <div><span>{lt(locale, 'reviewProgress')}</span><strong>{progress.dueReviewCount}</strong><span className="learning-stats-note">{progress.savedWordIds.length} {lt(locale, 'savedProgress')}</span></div>
    </div>
    <div className="learning-nav">
      <button className={view === 'today' ? 'active' : ''} onClick={() => setView('today')}>{lt(locale, 'today')}</button>
      <button className={view === 'review' ? 'active' : ''} onClick={() => setView('review')}>{lt(locale, 'review')} · {progress.dueReviewCount}</button>
      {progress.profile && <button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}>{lt(locale, 'editProfile')}</button>}
    </div>
    {error && <p className="learning-error" role="alert">{error}</p>}
    {view === 'profile' && <div className="learning-panel">
      <h2>{lt(locale, 'onboarding')}</h2><p>{lt(locale, 'intro')}</p>
      <div className="profile-grid">
        <label>{lt(locale, 'level')}<select value={profile.level} onChange={(e) => setProfile({ ...profile, level: e.target.value as LearningProfile['level'] })}>{(['new', 'basic', 'intermediate'] as const).map((value) => <option key={value} value={value}>{lt(locale, value)}</option>)}</select></label>
        <label>{lt(locale, 'target')}<select value={profile.targetHsk} onChange={(e) => setProfile({ ...profile, targetHsk: Number(e.target.value) })}>{[1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>HSK {value}</option>)}</select></label>
        <label>{lt(locale, 'date')}<input type="date" value={profile.targetDate} onChange={(e) => setProfile({ ...profile, targetDate: e.target.value })} /></label>
        <label>{lt(locale, 'minutes')}<input type="number" min="15" max="360" value={profile.dailyMinutes} onChange={(e) => setProfile({ ...profile, dailyMinutes: Number(e.target.value) })} /></label>
        <label>{lt(locale, 'explanationLanguage')}<select value={profile.explanationLocale} onChange={(e) => setProfile({ ...profile, explanationLocale: e.target.value as Locale })}><option value="vi-VN">Tiếng Việt</option><option value="en-US">English</option></select></label>
        <label className="check-label"><input type="checkbox" checked={profile.handwriting} onChange={(e) => setProfile({ ...profile, handwriting: e.target.checked })} />{lt(locale, 'handwriting')}</label>
      </div>
      <button className="learning-primary" disabled={busy || !profile.targetDate || profile.dailyMinutes < 15 || profile.dailyMinutes > 360} onClick={saveProfile}>{lt(locale, 'start')}</button>
    </div>}
    {view === 'today' && <div className="learning-panel">
      <div className="learning-top"><div><span className="eyebrow">{lt(locale, 'lesson')} {lessonIndex + 1} / {lessons.length}</span><h2>{lesson.title[locale]}</h2><p>{lesson.summary[locale]}</p></div><strong>{progress.completedLessonIds.length}/{lessons.length} {lt(locale, 'lessonProgress')}</strong></div>
      <div className="lesson-choices">{lessons.map((item, index) => <button key={item.id} className={index === lessonIndex ? 'active' : ''} onClick={() => { setLessonIndex(index); setExerciseIndex(0); setChoice(null); setOrder([]); setFeedback(null) }}>{item.title[locale]} {progress.completedLessonIds.includes(item.id) ? '✓' : ''}</button>)}</div>
      <div className="exercise-box"><span className="eyebrow">{lt(locale, 'exercise')} {exerciseIndex + 1} / {lesson.exercises.length}</span><h3>{exercise.prompt[locale]}</h3>
        {exercise.kind === 'choice' ? <div className="answer-options">{exercise.options.map((option, index) => <button key={index} className={choice === index ? 'active' : ''} aria-pressed={choice === index} onClick={() => { setChoice(index); setFeedback(null) }}>{option[locale]}</button>)}</div> : <><p>{lt(locale, 'orderHint')}</p><div className="order-answer" lang="zh-Hans">{order.map((id, index) => <span key={`${id}-${index}`}>{words[id].hanzi}</span>)}</div><div className="answer-options" lang="zh-Hans">{exercise.wordIds.map((id) => <button key={id} disabled={order.includes(id)} onClick={() => { setOrder([...order, id]); setFeedback(null) }}>{words[id].hanzi}</button>)}</div><button className="learning-text" onClick={() => { setOrder([]); setFeedback(null) }}>{lt(locale, 'clear')}</button></>}
        {feedback !== null && <div className={feedback ? 'exercise-feedback correct' : 'exercise-feedback'} role="status"><strong>{lt(locale, feedback ? 'correct' : 'incorrect')}</strong><p>{exercise.explanation[locale]}</p></div>}
        <div className="exercise-actions"><button className="learning-primary" disabled={busy || (exercise.kind === 'choice' ? choice === null : order.length !== exercise.wordIds.length)} onClick={checkExercise}>{lt(locale, 'submit')}</button>{feedback && <button onClick={nextExercise}>{lt(locale, 'continue')} →</button>}</div>
      </div>
    </div>}
    {view === 'review' && <div className="learning-panel"><h2>{lt(locale, 'review')}</h2>{reviewWord ? <div className="review-card"><strong lang="zh-Hans">{reviewWord.hanzi}</strong>{revealed ? <><p>{reviewWord.pinyin}</p><p>{reviewWord.meaning[locale]}</p><div className="exercise-actions"><button disabled={busy} onClick={() => rate('again')}>{lt(locale, 'again')}</button><button className="learning-primary" disabled={busy} onClick={() => rate('good')}>{lt(locale, 'good')}</button></div></> : <button className="learning-primary" onClick={() => setRevealed(true)}>{lt(locale, 'reveal')}</button>}</div> : <p>{lt(locale, 'noReview')}</p>}</div>}
  </section>
}
