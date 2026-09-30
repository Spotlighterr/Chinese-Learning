# Chinese Decoder — project instructions

Read this file before changing the product. Keep it at the root of the `Chineseapp` repository so future sessions inherit these requirements. Read relevant files in `docs/` once they exist. Preserve useful existing work and document major product decisions.

## Product and learner

- Build a serious Mandarin learning system for an adult Vietnamese learner starting near zero. The ambitious goal is to approach HSK 6 in about six months of intensive study while developing real Mandarin competence. HSK is an assessment checkpoint, not the whole curriculum.
- Teach the system before demanding memorization: pronunciation and tones, Hanzi structure, character versus word, semantic and phonetic components, phonetic families, compound formation, word boundaries, syntax, and reusable grammar patterns.
- The core learning progression is **understanding → pattern recognition → automaticity**. The product should help learners see structure that was previously invisible and eventually understand Chinese without constant Pinyin, segmentation, or translation.
- Make the Sentence Decoder the first strong vertical slice. Teach through sentences and lexical networks, not isolated word lists. Word segmentation, inference practice, and progressive hiding of scaffolds are first-class features.
- Teach useful components in encountered words; do not require memorizing all 214 Kangxi radicals. Model phonetic families explicitly. Distinguish modern structural analysis, historical etymology, and learner mnemonics; never present invented etymology as fact.
- Prioritize recognition, comprehension, pronunciation, listening, and Pinyin IME typing. Handwriting is optional and must never gate the main curriculum.
- Use data-driven lessons and trusted linguistic data. Make HSK mappings versionable. AI may assist explanations and practice but must not silently replace trusted lexical or curriculum data.
- Favor a clean, fast, keyboard-friendly learning instrument with layered explanations. Avoid a Duolingo clone, excessive gamification, streaks as the primary success metric, and a dashboard that overshadows the Sentence Decoder.

## Vietnamese-first is non-negotiable

- The initial product is **Mandarin learning designed for Vietnamese learners**. Vietnamese is a first-class language from the MVP, not a later translation pass.
- Default UI locale: **`vi-VN`**. Support **`en-US`** as an optional secondary locale. A Vietnamese learner with no English knowledge must be able to finish the entire MVP learning flow.
- Default explanation language: **Tiếng Việt**. Expose a setting named **Ngôn ngữ giải thích** with at least **Tiếng Việt** and **English**. English must never be required to use the product.
- Keep UI messages in a proper i18n layer from the start; do not scatter hard-coded Vietnamese strings through components. Chinese learning content stays Chinese regardless of UI locale.
- Localize linguistic content in the data layer, including word and character meanings, grammar, lesson and exercise instructions, feedback, component and phonetic-family explanations, and relevant AI tutor prompts. Never make an English-only `meaning` field the sole source of meaning.
- The beginner information hierarchy is **Hanzi → Pinyin → Vietnamese meaning**. Hanzi remains visually dominant. For example: **学习 / xuéxí / học; học tập**. Do not lead with English glosses.
- Use Vietnamese-specific teaching where it truly helps: familiarity with lexical tone, valid Hán-Việt relationships, and useful grammar comparisons. Mandarin and Vietnamese tones are not equivalent. Hán-Việt readings are clues, not proof that modern meanings and usage match; distinguish strong correspondences, partial correspondences, and misleading ones using curated data.
- Use Vietnamese by default for the AI tutor early on. As proficiency grows, gradually show more Chinese and make Vietnamese available on demand. Vietnamese translation, like Pinyin and visible segmentation, is scaffolding to remove progressively.
- Vietnamese diacritics must render correctly. Switching between `vi-VN` and `en-US` must preserve Chinese learning content and working lesson flows.

## MVP acceptance gate

The MVP is incomplete if its interface is primarily English, vocabulary has only English meanings, grammar explanations require English, Vietnamese is inconsistently added after the fact, locale switching breaks learning content, or Vietnamese diacritics render incorrectly. Review each usable vertical slice against this gate.

## Implementation sequence

1. Inspect the repository and existing conventions before changing architecture or code.
2. Record a concise assessment and maintain product, learning-model, architecture, data-model, curriculum, roadmap, and decision documentation in `docs/` as the project grows.
3. Build a usable Sentence Decoder with seed sentences, segmentation, Pinyin, Vietnamese meaning, token and character inspection, component and phonetic-family relationships, and progressive disclosure.
4. Add the remaining MVP pieces around that slice: onboarding with Vietnamese defaults, basic lessons and exercises, persisted review state, and meaningful progress tracking.
5. Verify the full Vietnamese learning flow and report limitations honestly. Make reversible engineering choices without blocking on minor questions.
