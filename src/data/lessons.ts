import type { LocalizedText } from './curriculum.ts'

type BaseExercise = {
  id: string
  prompt: LocalizedText
  explanation: LocalizedText
}

export type ChoiceExercise = BaseExercise & {
  kind: 'choice'
  skill: 'meaning' | 'pinyin' | 'component'
  options: LocalizedText[]
  correctIndex: number
}

export type OrderExercise = BaseExercise & {
  kind: 'order'
  skill: 'sentence-order'
  wordIds: string[]
  correctOrder: string[]
}

export type Exercise = ChoiceExercise | OrderExercise

export type Lesson = {
  id: string
  title: LocalizedText
  summary: LocalizedText
  sentenceId: string
  exercises: Exercise[]
}

export const lessons: Lesson[] = [
  {
    id: 'see-words',
    title: { 'vi-VN': 'Nhìn ra từng từ', 'en-US': 'See the words' },
    summary: { 'vi-VN': 'Một chữ có thể nằm trong nhiều từ. Đọc câu theo các đơn vị có nghĩa.', 'en-US': 'A character can belong to many words. Read in meaningful units.' },
    sentenceId: 'school',
    exercises: [
      {
        id: 'school-meaning', kind: 'choice', skill: 'meaning',
        prompt: { 'vi-VN': '学校 là một từ. Nghĩa của từ này là gì?', 'en-US': '学校 is one word. What does it mean?' },
        options: [
          { 'vi-VN': 'trường học', 'en-US': 'school' },
          { 'vi-VN': 'học tập', 'en-US': 'study' },
          { 'vi-VN': 'tiếng Trung', 'en-US': 'Chinese language' },
        ],
        correctIndex: 0,
        explanation: { 'vi-VN': '学校 / xuéxiào là “trường học”. 学 còn xuất hiện trong 学习, nhưng hai cụm là hai từ khác nhau.', 'en-US': '学校 / xuéxiào means “school”. 学 also appears in 学习, but these are different words.' },
      },
      {
        id: 'study-pinyin', kind: 'choice', skill: 'pinyin',
        prompt: { 'vi-VN': 'Chọn cách đọc của 学习.', 'en-US': 'Choose the pronunciation of 学习.' },
        options: [
          { 'vi-VN': 'xuéxiào', 'en-US': 'xuéxiào' },
          { 'vi-VN': 'xuéxí', 'en-US': 'xuéxí' },
          { 'vi-VN': 'xuéshēng', 'en-US': 'xuéshēng' },
        ],
        correctIndex: 1,
        explanation: { 'vi-VN': '学习 đọc là xuéxí. Cùng chữ 学 nhưng âm của chữ thứ hai làm nên một từ khác.', 'en-US': '学习 is xuéxí. It shares 学 with other words, but the second character changes the word.' },
      },
      {
        id: 'water-order', kind: 'order', skill: 'sentence-order',
        prompt: { 'vi-VN': 'Sắp xếp các từ thành câu “Mời bạn uống nước”.', 'en-US': 'Put these words in order: “Please have some water.”' },
        wordIds: ['he', 'qing', 'shui', 'ni'],
        correctOrder: ['qing', 'ni', 'he', 'shui'],
        explanation: { 'vi-VN': '请你喝水。= 请 / 你 / 喝 / 水. Trật tự của các từ giúp ta hiểu vai trò trong câu.', 'en-US': '请你喝水。= 请 / 你 / 喝 / 水. Word order helps reveal each word’s role.' },
      },
    ],
  },
  {
    id: 'sound-clues',
    title: { 'vi-VN': 'Manh mối gợi âm', 'en-US': 'Sound clues' },
    summary: { 'vi-VN': '请, 情, 清, 晴 cùng có 青 nhưng khác nghĩa và có thể khác thanh điệu.', 'en-US': '请, 情, 清 and 晴 share 青, but differ in meaning and sometimes tone.' },
    sentenceId: 'water',
    exercises: [
      {
        id: 'clear-semantic', kind: 'choice', skill: 'component',
        prompt: { 'vi-VN': 'Trong 清, phần nào thường gợi ý nghĩa liên quan đến nước?', 'en-US': 'In 清, which part often hints at a link to water?' },
        options: [
          { 'vi-VN': '忄', 'en-US': '忄' },
          { 'vi-VN': '氵', 'en-US': '氵' },
          { 'vi-VN': '讠', 'en-US': '讠' },
          { 'vi-VN': '日', 'en-US': '日' },
        ],
        correctIndex: 1,
        explanation: { 'vi-VN': '氵 là dạng bên của 水 và thường gợi nghĩa liên quan đến nước. Trong 清, 青 gợi âm.', 'en-US': '氵 is a side form of 水 and often hints at water. In 清, 青 hints at sound.' },
      },
      {
        id: 'qing-phonetic', kind: 'choice', skill: 'component',
        prompt: { 'vi-VN': '请 / 情 / 清 / 晴 cùng có phần nào gợi nhóm âm qing?', 'en-US': 'Which shared part hints at the qing sound family in 请 / 情 / 清 / 晴?' },
        options: [
          { 'vi-VN': '日', 'en-US': '日' },
          { 'vi-VN': '青', 'en-US': '青' },
          { 'vi-VN': '氵', 'en-US': '氵' },
          { 'vi-VN': '讠', 'en-US': '讠' },
        ],
        correctIndex: 1,
        explanation: { 'vi-VN': '青 là manh mối về âm đọc gần qing, không đảm bảo cùng thanh điệu.', 'en-US': '青 is a clue to a qing-like sound, not a guarantee of the same tone.' },
      },
    ],
  },
]
