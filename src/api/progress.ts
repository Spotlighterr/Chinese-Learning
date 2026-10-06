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
  exerciseAttemptsCount: number
  dueReviewCount: number
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
  saveProfile: (profile: LearningProfile) => request<Progress>('/api/profile', 'POST', profile),
  answerExercise: (lessonId: string, exerciseId: string, answer: number | string[]) =>
    request<{ correct: boolean; progress: Progress }>('/api/exercises', 'POST', { lessonId, exerciseId, answer }),
  dueReviews: () => request<{ wordIds: string[] }>('/api/reviews/due'),
  rateReview: (wordId: string, rating: 'again' | 'good') =>
    request<{ wordIds: string[]; progress: Progress }>('/api/reviews', 'POST', { wordId, rating }),
  saveWord: (wordId: string, saved: boolean) => request<Progress>('/api/progress/words', 'POST', { wordId, saved }),
  completeSentence: (sentenceId: string) => request<Progress>('/api/progress/sentences', 'POST', { sentenceId }),
  checkSegmentation: (sentenceId: string, positions: number[]) =>
    request<{ result: SegmentationResult; progress: Progress }>('/api/progress/segmentation', 'POST', { sentenceId, positions }),
}
