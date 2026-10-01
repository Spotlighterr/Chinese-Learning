export type ReviewState = { repetitions: number; intervalDays: number; ease: number; dueAt: number }
export type ReviewRating = 'again' | 'good'

export function scheduleReview(state: ReviewState, rating: ReviewRating, now = Date.now()): ReviewState {
  if (rating === 'again') {
    return { repetitions: 0, intervalDays: 0, ease: Math.max(1.3, state.ease - 0.2), dueAt: now + 10 * 60 * 1000 }
  }

  const intervalDays = state.repetitions === 0 ? 1 : state.repetitions === 1 ? 3 : Math.max(4, Math.round(state.intervalDays * state.ease))
  return { repetitions: state.repetitions + 1, intervalDays, ease: Math.min(3.0, state.ease + 0.05), dueAt: now + intervalDays * 24 * 60 * 60 * 1000 }
}
