import type { LocalizedText } from './curriculum.ts'

export type CourseUnit = {
  id: string
  stage: 'foundation'
  title: LocalizedText
  summary: LocalizedText
  lessonIds: string[]
}

// A versioned teaching sequence. HSK level mappings are added only after
// checking each item against a named official syllabus revision.
export const courseVersion = 'foundation-2026-10'
export const courseUnits: CourseUnit[] = [
  {
    id: 'first-conversation', stage: 'foundation',
    title: { 'vi-VN': 'Bắt đầu giao tiếp', 'en-US': 'Start communicating' },
    summary: { 'vi-VN': 'Lời chào, giới thiệu bản thân và nói về việc học.', 'en-US': 'Greetings, introducing yourself and talking about studying.' },
    lessonIds: ['first-greeting', 'introduce-self', 'study-chinese'],
  },
  {
    id: 'reuse-patterns', stage: 'foundation',
    title: { 'vi-VN': 'Dùng lại mẫu câu', 'en-US': 'Reuse sentence patterns' },
    summary: { 'vi-VN': 'Đổi người/vật, thêm thời gian và ý muốn để tạo câu mới.', 'en-US': 'Add time and intention to build new sentences from familiar words.' },
    lessonIds: ['drink-water', 'go-school', 'want-study'],
  },
  {
    id: 'decode-sentences', stage: 'foundation',
    title: { 'vi-VN': 'Giải mã câu', 'en-US': 'Decode sentences' },
    summary: { 'vi-VN': 'Từ ghép, trật tự từ và manh mối gợi nghĩa/gợi âm.', 'en-US': 'Compound words, word order and meaning/sound clues.' },
    lessonIds: ['see-words', 'sound-clues', 'weather-clues'],
  },
]

export const courseLessonIds = courseUnits.flatMap((unit) => unit.lessonIds)

export function recommendedLessonId(completedLessonIds: readonly string[]): string | null {
  const completed = new Set(completedLessonIds)
  return courseLessonIds.find((id) => !completed.has(id)) ?? null
}
