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

export type InputExercise = BaseExercise & {
  kind: 'input'
  skill: 'hanzi-typing'
  answer: string
}

export type Exercise = ChoiceExercise | OrderExercise | InputExercise

export type Lesson = {
  id: string
  title: LocalizedText
  summary: LocalizedText
  sentenceId: string
  exercises: Exercise[]
}

export const lessons: Lesson[] = [
  {
    id: 'first-greeting',
    title: { 'vi-VN': 'Chào bằng tiếng Trung', 'en-US': 'Say hello in Chinese' },
    summary: { 'vi-VN': 'Nghe 你好, nhìn từng âm tiết và gõ lại bằng bộ gõ Pinyin.', 'en-US': 'Hear 你好, notice each syllable and type it with a Pinyin IME.' },
    sentenceId: 'hello',
    exercises: [
      {
        id: 'hello-meaning', kind: 'choice', skill: 'meaning',
        prompt: { 'vi-VN': '你好 dùng để làm gì?', 'en-US': 'What is 你好 used for?' },
        options: [
          { 'vi-VN': 'chào hỏi', 'en-US': 'greeting' },
          { 'vi-VN': 'cảm ơn', 'en-US': 'thanking' },
          { 'vi-VN': 'xin lỗi', 'en-US': 'apologizing' },
        ],
        correctIndex: 0,
        explanation: { 'vi-VN': '你好 / nǐ hǎo là một lời chào thông dụng. Hai âm tiết đều có thanh 3 trên Pinyin cơ bản.', 'en-US': '你好 / nǐ hǎo is a common greeting. Both syllables have third tone in their underlying Pinyin.' },
      },
      {
        id: 'hello-type', kind: 'input', skill: 'hanzi-typing',
        prompt: { 'vi-VN': 'Dùng bộ gõ Pinyin để gõ lời chào “xin chào” bằng chữ Hán.', 'en-US': 'Use a Pinyin IME to type “hello” in Hanzi.' },
        answer: '你好',
        explanation: { 'vi-VN': 'Gõ ni hao rồi chọn 你好. Bộ gõ giúp luyện nhận diện chữ; không cần viết tay.', 'en-US': 'Type ni hao and select 你好. IME typing builds character recognition without requiring handwriting.' },
      },
    ],
  },
  {
    id: 'introduce-self',
    title: { 'vi-VN': 'Giới thiệu bản thân', 'en-US': 'Introduce yourself' },
    summary: { 'vi-VN': 'Dùng 我是… để nói mình là ai; nhận ra 学生 là một từ.', 'en-US': 'Use 我是… to say who you are; recognize 学生 as one word.' },
    sentenceId: 'identity',
    exercises: [
      {
        id: 'student-meaning', kind: 'choice', skill: 'meaning',
        prompt: { 'vi-VN': 'Trong câu 我是学生, 学生 nghĩa là gì?', 'en-US': 'In 我是学生, what does 学生 mean?' },
        options: [
          { 'vi-VN': 'học sinh; sinh viên', 'en-US': 'student' },
          { 'vi-VN': 'trường học', 'en-US': 'school' },
          { 'vi-VN': 'học tập', 'en-US': 'study' },
        ],
        correctIndex: 0,
        explanation: { 'vi-VN': '学生 / xuéshēng là người học; 学校 / xuéxiào là trường học.', 'en-US': '学生 / xuéshēng is a student; 学校 / xuéxiào is a school.' },
      },
      {
        id: 'identity-order', kind: 'order', skill: 'sentence-order',
        prompt: { 'vi-VN': 'Sắp xếp thành câu “Tôi là học sinh/sinh viên”.', 'en-US': 'Arrange “I am a student.”' },
        wordIds: ['xuesheng', 'wo', 'shi'], correctOrder: ['wo', 'shi', 'xuesheng'],
        explanation: { 'vi-VN': 'Mẫu cơ bản: 我 / 是 / 学生. Không thêm 是 trước động từ học trong câu 我学习中文.', 'en-US': 'Basic pattern: 我 / 是 / 学生. Do not put 是 before the verb 学习 in 我学习中文.' },
      },
      {
        id: 'identity-type', kind: 'input', skill: 'hanzi-typing',
        prompt: { 'vi-VN': 'Gõ “Tôi là học sinh/sinh viên” bằng chữ Hán.', 'en-US': 'Type “I am a student” in Hanzi.' },
        answer: '我是学生',
        explanation: { 'vi-VN': '我是学生 gồm 我 + 是 + 学生. Có thể gõ wo shi xue sheng bằng bộ gõ Pinyin.', 'en-US': '我是学生 is 我 + 是 + 学生. You can enter wo shi xue sheng with a Pinyin IME.' },
      },
    ],
  },
  {
    id: 'study-chinese',
    title: { 'vi-VN': 'Nói về việc học', 'en-US': 'Talk about studying' },
    summary: { 'vi-VN': 'Đọc và tự tạo câu 我学习中文 theo trật tự người làm – hành động – nội dung.', 'en-US': 'Read and build 我学习中文 with subject – action – object order.' },
    sentenceId: 'study',
    exercises: [
      {
        id: 'study-order', kind: 'order', skill: 'sentence-order',
        prompt: { 'vi-VN': 'Sắp xếp thành câu “Tôi học tiếng Trung”.', 'en-US': 'Arrange “I study Chinese.”' },
        wordIds: ['zhongwen', 'wo', 'xuexi'], correctOrder: ['wo', 'xuexi', 'zhongwen'],
        explanation: { 'vi-VN': '我 / 学习 / 中文. 是 dùng để nối với danh từ như 学生, không cần trong câu này.', 'en-US': '我 / 学习 / 中文. 是 links to a noun such as 学生; it is not needed here.' },
      },
      {
        id: 'study-type', kind: 'input', skill: 'hanzi-typing',
        prompt: { 'vi-VN': 'Gõ “Tôi học tiếng Trung” bằng chữ Hán.', 'en-US': 'Type “I study Chinese” in Hanzi.' },
        answer: '我学习中文',
        explanation: { 'vi-VN': 'Hãy nhận ra 学习 và 中文 là hai từ trước khi gõ cả câu.', 'en-US': 'Recognize 学习 and 中文 as two words before typing the sentence.' },
      },
    ],
  },
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
  {
    id: 'weather-clues',
    title: { 'vi-VN': 'Đọc câu về thời tiết', 'en-US': 'Read a weather sentence' },
    summary: { 'vi-VN': 'Trong 今天 / 天气 / 晴朗, nhận diện từ ghép trước khi nhìn từng chữ.', 'en-US': 'In 今天 / 天气 / 晴朗, find the words before inspecting individual characters.' },
    sentenceId: 'weather',
    exercises: [
      {
        id: 'weather-order', kind: 'order', skill: 'sentence-order',
        prompt: { 'vi-VN': 'Sắp xếp các từ thành câu “Hôm nay thời tiết quang đãng”.', 'en-US': 'Put the words in order: “The weather is clear today.”' },
        wordIds: ['qinglang', 'jintian', 'tianqi'],
        correctOrder: ['jintian', 'tianqi', 'qinglang'],
        explanation: { 'vi-VN': '今天 / 天气 / 晴朗 là ba từ. Chữ 天 nằm trong hai từ đầu nhưng vai trò của cả từ khác nhau.', 'en-US': '今天 / 天气 / 晴朗 are three words. 天 appears in the first two, but the words have different roles.' },
      },
      {
        id: 'weather-meaning', kind: 'choice', skill: 'meaning',
        prompt: { 'vi-VN': 'Trong câu 今天 天气 晴朗, 晴朗 có nghĩa là gì?', 'en-US': 'In 今天 天气 晴朗, what does 晴朗 mean?' },
        options: [
          { 'vi-VN': 'quang đãng', 'en-US': 'clear and bright' },
          { 'vi-VN': 'hôm nay', 'en-US': 'today' },
          { 'vi-VN': 'thời tiết', 'en-US': 'weather' },
        ],
        correctIndex: 0,
        explanation: { 'vi-VN': '晴朗 / qínglǎng nghĩa là quang đãng. Trong 晴, 日 là manh mối về nghĩa, 青 là manh mối về âm.', 'en-US': '晴朗 / qínglǎng means clear and bright. In 晴, 日 hints at meaning and 青 hints at sound.' },
      },
    ],
  },
]
