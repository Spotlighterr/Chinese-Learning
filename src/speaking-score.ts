function hanzi(value: string) { return [...value.normalize('NFKC').replace(/[^\p{Script=Han}]/gu, '')] }

export function contentMatch(expected: string, actual: string): number | null {
  const left = hanzi(expected), right = hanzi(actual)
  if (!right.length) return null
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let i = 1; i <= left.length; i++) {
    const current = [i]
    for (let j = 1; j <= right.length; j++) current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + Number(left[i - 1] !== right[j - 1]))
    previous.splice(0, previous.length, ...current)
  }
  return Math.round(100 * Math.max(0, 1 - previous[right.length] / Math.max(left.length, right.length)))
}
