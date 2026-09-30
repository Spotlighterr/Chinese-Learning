export type Progress = {
  completedSentenceIds: string[]
  savedWordIds: string[]
  attemptsCount: number
  bestBySentence: Record<string, { correct: number; extra: number; total: number }>
}

export type SegmentationResult = {
  correct: number
  extra: number
  missing: number
  total: number
  perfect: boolean
  expected: number[]
}

async function request<T>(url: string, method: 'GET' | 'POST' = 'GET', body?: object): Promise<T> {
  const response = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!response.ok) throw new Error(`API ${response.status}`)
  return response.json() as Promise<T>
}

export const progressApi = {
  get: () => request<Progress>('/api/progress'),
  saveWord: (wordId: string, saved: boolean) => request<Progress>('/api/progress/words', 'POST', { wordId, saved }),
  completeSentence: (sentenceId: string) => request<Progress>('/api/progress/sentences', 'POST', { sentenceId }),
  checkSegmentation: (sentenceId: string, positions: number[]) =>
    request<{ result: SegmentationResult; progress: Progress }>('/api/progress/segmentation', 'POST', { sentenceId, positions }),
}
