import { useEffect, useState } from 'react'
import { progressApi, type Progress, type SegmentationResult } from './api/progress'
import { Inspector } from './components/Inspector'
import { LearningFlow } from './components/LearningFlow'
import { SegmentationPractice } from './components/SegmentationPractice'
import { SpeakingPractice } from './components/SpeakingPractice'
import { sentenceHanzi, sentences, words, type Locale } from './data/curriculum'
import { t } from './i18n'

type ReadingMode = 0 | 1 | 2 | 3
const modeKeys = ['guided', 'noPinyin', 'noMeaning', 'fluent'] as const

function initialLocale(): Locale {
  try { return localStorage.getItem('decoder-locale') === 'en-US' ? 'en-US' : 'vi-VN' }
  catch { return 'vi-VN' }
}

let firstProgressRequest: Promise<Progress> | null = null
function loadInitialProgress() {
  if (!firstProgressRequest) firstProgressRequest = progressApi.get().finally(() => { firstProgressRequest = null })
  return firstProgressRequest
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(initialLocale)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [mode, setMode] = useState<ReadingMode>(0)
  const [selectedWordId, setSelectedWordId] = useState(sentences[0].focusWordId)
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null)
  const [meaningOverride, setMeaningOverride] = useState<boolean | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [apiError, setApiError] = useState(false)
  const [busy, setBusy] = useState(false)

  const sentence = sentences[sentenceIndex]
  const selectedWord = words[selectedWordId]
  const completed = progress?.completedSentenceIds.includes(sentence.id) ?? false
  const saved = progress?.savedWordIds.includes(selectedWordId) ?? false
  const showPinyin = mode === 0
  const showMeaning = meaningOverride ?? mode < 2

  useEffect(() => {
    document.documentElement.lang = locale === 'vi-VN' ? 'vi' : 'en'
    try { localStorage.setItem('decoder-locale', locale) } catch { /* optional preference persistence */ }
  }, [locale])

  useEffect(() => {
    let current = true
    loadInitialProgress().then((value) => { if (current) { setProgress(value); setApiError(false) } })
      .catch(() => { if (current) setApiError(true) })
    return () => { current = false }
  }, [])

  function chooseSentence(index: number) {
    setSentenceIndex(index)
    setSelectedWordId(sentences[index].focusWordId)
    setActiveCharacter(null)
    setMeaningOverride(null)
  }

  function chooseWord(id: string) {
    setSelectedWordId(id)
    setActiveCharacter(null)
  }

  async function saveWord() {
    setBusy(true)
    try { setProgress(await progressApi.saveWord(selectedWordId, !saved)); setApiError(false) }
    catch { setApiError(true) }
    finally { setBusy(false) }
  }

  async function completeSentence() {
    setBusy(true)
    try { setProgress(await progressApi.completeSentence(sentence.id)); setApiError(false) }
    catch { setApiError(true) }
    finally { setBusy(false) }
  }

  async function checkSegmentation(positions: number[]): Promise<SegmentationResult> {
    const response = await progressApi.checkSegmentation(sentence.id, positions)
    setProgress(response.progress)
    setApiError(false)
    return response.result
  }

  return <div className="app-shell">
    <header className="site-header">
      <div className="brand-lockup"><span className="brand-symbol" aria-hidden="true">解</span><span className="brand-name">{t(locale, 'appName')}<small>{t(locale, 'tagline')}</small></span></div>
      <div className="header-right">
        <span className="header-module">01 / {t(locale, 'title')}</span>
        <label className="language-switch"><span>{t(locale, 'explanationLanguage')}</span>
          <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
            <option value="vi-VN">{t(locale, 'vietnamese')}</option>
            <option value="en-US">{t(locale, 'english')}</option>
          </select>
        </label>
      </div>
    </header>

    <main>
      <section className="intro-section">
        <div><div className="eyebrow intro-eyebrow"><span className="eyebrow-line" /> {t(locale, 'module')} · MANDARIN DECODER</div>
          <h1>{t(locale, 'title')}<span className="title-period">.</span></h1>
          <p className="intro-lead">{t(locale, 'lead')}</p>
        </div>
        <div className="progress-summary" aria-label="Progress">
          <div><strong>{progress?.completedSentenceIds.length ?? '—'}<span>/ {sentences.length}</span></strong><small>{t(locale, 'decoded')}</small></div>
          <div><strong>{progress?.savedWordIds.length ?? '—'}</strong><small>{t(locale, 'saved')}</small></div>
          <div><strong>{progress?.attemptsCount ?? '—'}</strong><small>{t(locale, 'practice')}</small></div>
        </div>
      </section>

      {apiError && <div className="api-banner" role="alert"><span>{t(locale, 'apiError')}</span><button onClick={() => loadInitialProgress().then((value) => { setProgress(value); setApiError(false) }).catch(() => setApiError(true))}>{t(locale, 'retry')}</button></div>}

      {progress && <LearningFlow locale={locale} progress={progress} onProgress={setProgress} onLocale={setLocale} />}

      <div className="workspace-grid">
        <nav className="lesson-sidebar" aria-label={t(locale, 'lessonList')}>
          <div className="sidebar-heading"><span className="eyebrow">{t(locale, 'lessonList')}</span><span>01 — 03</span></div>
          <div className="sentence-list">
            {sentences.map((item, index) => <button key={item.id} className={index === sentenceIndex ? 'sentence-link active' : 'sentence-link'} onClick={() => chooseSentence(index)} aria-current={index === sentenceIndex ? 'page' : undefined}>
              <span className="sentence-link-number">0{index + 1}</span>
              <span className="sentence-link-body"><strong lang="zh-Hans">{sentenceHanzi(item)}</strong><small>{item.focus[locale]}</small></span>
              <span className="sentence-link-mark" aria-hidden="true">{progress?.completedSentenceIds.includes(item.id) ? '✓' : '↗'}</span>
            </button>)}
          </div>
          <div className="sidebar-note"><span className="sidebar-note-mark" aria-hidden="true">✳</span><span>{t(locale, 'note')}</span></div>
        </nav>

        <div className="learning-column">
          <section className="decoder-card" aria-labelledby="decoder-heading">
            <div className="decoder-header"><div><span className="eyebrow">{t(locale, 'lessonNumber')} 0{sentenceIndex + 1} / 0{sentences.length}</span><h2 id="decoder-heading">{t(locale, 'viewing')} 0{sentenceIndex + 1}</h2></div><span className="card-corner" aria-hidden="true">↗</span></div>
            <p className="sentence-focus"><span>{t(locale, 'lessonFocus')}</span> {sentence.focus[locale]}</p>
            <div className="mode-heading"><span className="eyebrow">{t(locale, 'readingLevel')}</span><span className="mode-count">0{mode + 1} / 04</span></div>
            <div className="mode-picker" role="group" aria-label={t(locale, 'readingLevel')}>
              {modeKeys.map((key, index) => <button key={key} className={mode === index ? 'mode-button active' : 'mode-button'} aria-pressed={mode === index} onClick={() => { setMode(index as ReadingMode); setMeaningOverride(null) }}>{t(locale, key)}</button>)}
            </div>

            <div className={mode === 3 ? 'sentence-stage fluent' : 'sentence-stage'}>
              <div className="hanzi-line" lang="zh-Hans">
                {sentence.tokens.map((id, index) => {
                  const word = words[id]
                  return <button key={`${id}-${index}`} className={id === selectedWordId && !activeCharacter ? 'token active' : 'token'} onClick={() => chooseWord(id)} aria-pressed={id === selectedWordId && !activeCharacter} aria-label={`${word.hanzi}${showPinyin ? `, ${word.pinyin}` : ''}`}>
                    <span className="token-hanzi">{word.hanzi}{index === sentence.tokens.length - 1 && <span className="inline-punctuation">。</span>}</span>
                    {showPinyin && <span className="token-pinyin" aria-hidden="true">{word.pinyin}</span>}
                  </button>
                })}
              </div>
              <p className="stage-hint">{t(locale, 'tapWord')}</p>
            </div>

            <div className="translation-block">
              <div className="translation-heading"><span className="eyebrow">{t(locale, 'sentenceMeaning')}</span><button className="text-button" onClick={() => setMeaningOverride(!showMeaning)}>{t(locale, showMeaning ? 'hideMeaning' : 'showMeaning')} {showMeaning ? '−' : '+'}</button></div>
              {showMeaning ? <p>{sentence.translation[locale]}</p> : <p className="hidden-meaning">••••••••••••••••••</p>}
            </div>

            <details className="insight-details"><summary>{t(locale, 'why')} <span aria-hidden="true">+</span></summary><p>{sentence.insight[locale]}</p></details>
            <div className="decoder-footer"><span>{progress === null && !apiError ? t(locale, 'loading') : sentenceHanzi(sentence)}</span><button className={completed ? 'complete-button completed' : 'complete-button'} disabled={busy || completed || !progress} onClick={completeSentence}>{completed ? t(locale, 'markedUnderstood') : t(locale, 'markUnderstood')} <span aria-hidden="true">{completed ? '✓' : '↗'}</span></button></div>
          </section>

          <SpeakingPractice key={`speaking-${sentence.id}`} locale={locale} hanzi={sentenceHanzi(sentence)} pinyin={sentence.tokens.map((id) => words[id].pinyin).join(' ')} />
          <SegmentationPractice key={`segmentation-${sentence.id}`} sentence={sentence} locale={locale} best={progress?.bestBySentence[sentence.id]} onCheck={checkSegmentation} />
        </div>

        <Inspector locale={locale} word={selectedWord} activeCharacter={activeCharacter} saved={saved} busy={busy || !progress} onCharacter={setActiveCharacter} onWord={chooseWord} onSave={saveWord} />
      </div>
    </main>
    <footer className="site-footer"><span>CHINESE DECODER / 2026</span><span>汉字 · 词语 · 句子</span></footer>
  </div>
}
