import { sentences, words } from '../src/data/curriculum.ts'

export function analyzeSegmentation(sentenceId: string, positions: number[]) {
  const sentence = sentences.find((item) => item.id === sentenceId)
  if (!sentence) return null

  const lengths = sentence.tokens.map((id) => [...words[id].hanzi].length)
  const textLength = lengths.reduce((sum, length) => sum + length, 0)
  if (
    positions.length > textLength - 1 ||
    new Set(positions).size !== positions.length ||
    positions.some((value) => !Number.isInteger(value) || value < 1 || value >= textLength)
  ) return null

  let offset = 0
  const expected = new Set(lengths.slice(0, -1).map((length) => (offset += length)))
  const chosen = new Set(positions)
  const correct = positions.filter((position) => expected.has(position)).length
  const extra = positions.filter((position) => !expected.has(position)).length
  const missing = [...expected].filter((position) => !chosen.has(position)).length

  return {
    correct,
    extra,
    missing,
    total: expected.size,
    perfect: extra === 0 && missing === 0,
    expected: [...expected],
  }
}
