import { useState } from 'react'
import type { SegmentationResult } from '../api/progress'
import { sentenceHanzi, words, type Locale, type Sentence } from '../data/curriculum'
import { t } from '../i18n'

type Props = {
  sentence: Sentence
  locale: Locale
  best?: { correct: number; extra: number; total: number }
  onCheck: (positions: number[]) => Promise<SegmentationResult>
}

export function SegmentationPractice({ sentence, locale, best, onCheck }: Props) {
  const [positions, setPositions] = useState<number[]>([])
  const [result, setResult] = useState<SegmentationResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const glyphs = [...sentenceHanzi(sentence).slice(0, -1)]

  function toggle(position: number) {
    setPositions((current) => current.includes(position) ? current.filter((item) => item !== position) : [...current, position])
    setResult(null)
    setError(false)
  }

  async function submit() {
    setBusy(true)
    setError(false)
    try { setResult(await onCheck(positions)) }
    catch { setError(true) }
    finally { setBusy(false) }
  }

  return <section className="practice-card" aria-labelledby="practice-heading">
    <div className="section-heading">
      <div><span className="eyebrow">02 / {t(locale, 'practice').toUpperCase()}</span><h2 id="practice-heading">{t(locale, 'segmentationTitle')}</h2></div>
      {best && <span className="best-score">{t(locale, 'best')}: {best.correct}/{best.total}</span>}
    </div>
    <p className="muted">{t(locale, 'segmentationLead')}</p>
    <div className="segmentation-board" lang="zh-Hans">
      {glyphs.map((glyph, index) => <span className="segmentation-unit" key={`${glyph}-${index}`}>
        <span className="segmentation-glyph">{glyph}</span>
        {index < glyphs.length - 1 && <button
          type="button"
          className={positions.includes(index + 1) ? 'boundary selected' : 'boundary'}
          aria-pressed={positions.includes(index + 1)}
          aria-label={locale === 'vi-VN' ? `Ranh giới sau chữ ${glyph}, vị trí ${index + 1}` : `Boundary after ${glyph}, position ${index + 1}`}
          onClick={() => toggle(index + 1)}
        ><span aria-hidden="true">{positions.includes(index + 1) ? '／' : '·'}</span></button>}
      </span>)}
      <span className="segmentation-period">{sentence.punctuation ?? '。'}</span>
    </div>
    <div className="practice-actions">
      <button className="primary-button" onClick={submit} disabled={busy || result !== null}>{t(locale, 'check')} <span aria-hidden="true">↗</span></button>
      <button className="secondary-button" onClick={() => { setPositions([]); setResult(null); setError(false) }}>{t(locale, 'reset')}</button>
    </div>
    {result && <div className={result.perfect ? 'practice-feedback perfect' : 'practice-feedback'} role="status">
      <strong>{result.perfect ? t(locale, 'perfect') : t(locale, 'keepGoing')}</strong>
      <span>{result.correct}/{result.total} {t(locale, 'boundaries')} · {result.extra} {t(locale, 'extraBoundaries')}</span>
      <span>{t(locale, 'answer')}: <span lang="zh-Hans">{sentence.tokens.map((id) => words[id].hanzi).join(' / ')}</span></span>
    </div>}
    {error && <p className="error-message" role="alert">{t(locale, 'apiError')}</p>}
  </section>
}
