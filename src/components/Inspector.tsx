import { characters, components, phoneticFamilies, relatedWords, type Locale, type Word } from '../data/curriculum'
import { t } from '../i18n'

type Props = {
  locale: Locale
  word: Word
  activeCharacter: string | null
  saved: boolean
  busy: boolean
  onCharacter: (hanzi: string | null) => void
  onWord: (id: string) => void
  onSave: () => void
}

export function Inspector({ locale, word, activeCharacter, saved, busy, onCharacter, onWord, onSave }: Props) {
  if (activeCharacter) {
    const character = characters[activeCharacter]
    const family = character.familyId ? phoneticFamilies[character.familyId as keyof typeof phoneticFamilies] : null
    const related = relatedWords(activeCharacter)
    return (
      <aside className="inspector" aria-label={t(locale, 'inspectCharacter')}>
        <div className="inspector-topline">
          <span className="eyebrow">{t(locale, 'inspectCharacter')}</span>
          <button className="text-button" onClick={() => onCharacter(null)}>{t(locale, 'backToWord')} ↗</button>
        </div>
        <div className="inspector-hero character-hero">
          <span className="character-large" lang="zh-Hans">{character.hanzi}</span>
          <div>
            <span className="eyebrow">{t(locale, 'character')}</span>
            <div className="inspector-pinyin">{character.pinyin}</div>
            <div className="inspector-meaning">{character.meaning[locale]}</div>
          </div>
        </div>

        <section className="inspector-section">
          <h3>{t(locale, 'components')}</h3>
          {character.components ? (
            <div className="component-list">
              {character.components.map((relation) => (
                <div className="component-row" key={relation.component}>
                  <span className="component-glyph" lang="zh-Hans">{relation.component}</span>
                  <div>
                    <span className="micro-label">{t(locale, relation.role)} · {components[relation.component].meaning[locale]}</span>
                    <p>{relation.note[locale]}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="muted">{t(locale, 'noAnalysis')}</p>}
        </section>

        {family && <section className="inspector-section">
          <h3>{t(locale, 'family')} <span lang="zh-Hans">{family.key}</span></h3>
          <p className="muted">{family.note[locale]}</p>
          <div className="family-list">
            {family.members.map((hanzi) => (
              <button className={hanzi === activeCharacter ? 'family-item active' : 'family-item'} key={hanzi} onClick={() => onCharacter(hanzi)}>
                <span lang="zh-Hans">{hanzi}</span><small>{characters[hanzi].pinyin}</small>
              </button>
            ))}
          </div>
        </section>}

        {related.length > 0 && <section className="inspector-section">
          <h3>{t(locale, 'related')}</h3>
          <div className="related-list">
            {related.map((item) => <button key={item.id} className="related-item" onClick={() => onWord(item.id)}>
              <span lang="zh-Hans">{item.hanzi}</span><small>{item.meaning[locale]}</small>
            </button>)}
          </div>
        </section>}
      </aside>
    )
  }

  const related = relatedWords(word.hanzi, word.id)
  return (
    <aside className="inspector" aria-label={t(locale, 'inspectWord')}>
      <div className="inspector-topline"><span className="eyebrow">{t(locale, 'inspectWord')}</span><span className="inspector-index" lang="zh-Hans">词 / 字</span></div>
      <div className="inspector-hero word-hero">
        <span className="word-large" lang="zh-Hans">{word.hanzi}</span>
        <div className="inspector-pinyin">{word.pinyin}</div>
        <div className="inspector-meaning">{word.meaning[locale]}</div>
      </div>
      <button className={saved ? 'save-button saved' : 'save-button'} onClick={onSave} disabled={busy}>
        <span aria-hidden="true">{saved ? '✓' : '+'}</span> {t(locale, saved ? 'unsaveWord' : 'saveWord')}
      </button>
      {word.note && <p className="word-note">{word.note[locale]}</p>}

      <section className="inspector-section">
        <h3>{t(locale, 'composition')}</h3>
        <div className="character-list">
          {[...word.hanzi].map((hanzi, index) => {
            const item = characters[hanzi]
            return <button className="character-card" key={`${hanzi}-${index}`} onClick={() => onCharacter(hanzi)}>
              <span className="character-card-hanzi" lang="zh-Hans">{hanzi}</span>
              <span className="character-card-info"><strong>{item.pinyin}</strong><small>{item.meaning[locale]}</small></span>
              <span className="character-card-arrow" aria-hidden="true">↗</span>
            </button>
          })}
        </div>
      </section>

      {related.length > 0 && <section className="inspector-section">
        <h3>{t(locale, 'related')}</h3>
        <div className="related-list">
          {related.map((item) => <button key={item.id} className="related-item" onClick={() => onWord(item.id)}>
            <span lang="zh-Hans">{item.hanzi}</span><small>{item.meaning[locale]}</small>
          </button>)}
        </div>
      </section>}
      <p className="inspector-footnote">{t(locale, 'note')}</p>
    </aside>
  )
}
