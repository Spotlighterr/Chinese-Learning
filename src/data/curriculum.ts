export type Locale = 'vi-VN' | 'en-US'
export type LocalizedText = Record<Locale, string>

export type ComponentRelation = {
  component: string
  role: 'semantic' | 'phonetic'
  note: LocalizedText
}

export type Character = {
  hanzi: string
  pinyin: string
  meaning: LocalizedText
  components?: ComponentRelation[]
  familyId?: string
}

export type Word = {
  id: string
  hanzi: string
  pinyin: string
  meaning: LocalizedText
  note?: LocalizedText
}

export type Sentence = {
  id: string
  tokens: string[]
  focusWordId: string
  translation: LocalizedText
  insight: LocalizedText
  focus: LocalizedText
}

export const characters: Record<string, Character> = {
  我: { hanzi: '我', pinyin: 'wǒ', meaning: { 'vi-VN': 'tôi', 'en-US': 'I; me' } },
  今: { hanzi: '今', pinyin: 'jīn', meaning: { 'vi-VN': 'nay; hiện tại', 'en-US': 'now; present' } },
  天: { hanzi: '天', pinyin: 'tiān', meaning: { 'vi-VN': 'trời; ngày', 'en-US': 'sky; day' } },
  下: { hanzi: '下', pinyin: 'xià', meaning: { 'vi-VN': 'dưới; sau', 'en-US': 'below; next' } },
  午: { hanzi: '午', pinyin: 'wǔ', meaning: { 'vi-VN': 'buổi trưa', 'en-US': 'noon' } },
  想: { hanzi: '想', pinyin: 'xiǎng', meaning: { 'vi-VN': 'muốn; nghĩ', 'en-US': 'want; think' } },
  去: { hanzi: '去', pinyin: 'qù', meaning: { 'vi-VN': 'đi', 'en-US': 'go' } },
  学: { hanzi: '学', pinyin: 'xué', meaning: { 'vi-VN': 'học', 'en-US': 'learn; study' } },
  校: { hanzi: '校', pinyin: 'xiào', meaning: { 'vi-VN': 'trường (trong 学校)', 'en-US': 'school (in 学校)' } },
  习: { hanzi: '习', pinyin: 'xí', meaning: { 'vi-VN': 'luyện tập', 'en-US': 'practice' } },
  中: { hanzi: '中', pinyin: 'zhōng', meaning: { 'vi-VN': 'giữa; Trung Quốc', 'en-US': 'middle; China' } },
  文: { hanzi: '文', pinyin: 'wén', meaning: { 'vi-VN': 'văn; ngôn ngữ', 'en-US': 'writing; language' } },
  请: {
    hanzi: '请', pinyin: 'qǐng', meaning: { 'vi-VN': 'mời; xin', 'en-US': 'please; invite' }, familyId: 'qing',
    components: [
      { component: '讠', role: 'semantic', note: { 'vi-VN': 'Thường gợi ý nghĩa liên quan đến lời nói.', 'en-US': 'Often suggests a link to speech.' } },
      { component: '青', role: 'phonetic', note: { 'vi-VN': 'Gợi ý một nhóm cách đọc gần âm qing; thanh điệu có thể khác.', 'en-US': 'Hints at a qing-like sound family; tones can differ.' } },
    ],
  },
  你: { hanzi: '你', pinyin: 'nǐ', meaning: { 'vi-VN': 'bạn', 'en-US': 'you' } },
  喝: { hanzi: '喝', pinyin: 'hē', meaning: { 'vi-VN': 'uống', 'en-US': 'drink' } },
  水: { hanzi: '水', pinyin: 'shuǐ', meaning: { 'vi-VN': 'nước', 'en-US': 'water' } },
  气: { hanzi: '气', pinyin: 'qì', meaning: { 'vi-VN': 'khí; không khí', 'en-US': 'air; gas' } },
  晴: {
    hanzi: '晴', pinyin: 'qíng', meaning: { 'vi-VN': 'trời quang', 'en-US': 'clear weather' }, familyId: 'qing',
    components: [
      { component: '日', role: 'semantic', note: { 'vi-VN': 'Gợi ý nghĩa liên quan đến mặt trời hoặc ánh sáng.', 'en-US': 'Suggests a link to the sun or light.' } },
      { component: '青', role: 'phonetic', note: { 'vi-VN': 'Gợi ý cách đọc gần qing.', 'en-US': 'Hints at a qing-like pronunciation.' } },
    ],
  },
  朗: { hanzi: '朗', pinyin: 'lǎng', meaning: { 'vi-VN': 'sáng; quang đãng', 'en-US': 'bright; clear' } },
  生: { hanzi: '生', pinyin: 'shēng', meaning: { 'vi-VN': 'sinh; người học (trong 学生)', 'en-US': 'life; student (in 学生)' } },
  大: { hanzi: '大', pinyin: 'dà', meaning: { 'vi-VN': 'lớn', 'en-US': 'big' } },
  国: { hanzi: '国', pinyin: 'guó', meaning: { 'vi-VN': 'quốc gia', 'en-US': 'country' } },
  问: { hanzi: '问', pinyin: 'wèn', meaning: { 'vi-VN': 'hỏi', 'en-US': 'ask' } },
  楚: { hanzi: '楚', pinyin: 'chǔ', meaning: { 'vi-VN': 'rõ (trong 清楚)', 'en-US': 'clear (in 清楚)' } },
  心: { hanzi: '心', pinyin: 'xīn', meaning: { 'vi-VN': 'tim; tâm trí', 'en-US': 'heart; mind' } },
  情: {
    hanzi: '情', pinyin: 'qíng', meaning: { 'vi-VN': 'tình cảm; tình trạng', 'en-US': 'feeling; situation' }, familyId: 'qing',
    components: [
      { component: '忄', role: 'semantic', note: { 'vi-VN': 'Thường gợi ý nghĩa liên quan đến cảm xúc hoặc tâm trí.', 'en-US': 'Often suggests emotion or mental state.' } },
      { component: '青', role: 'phonetic', note: { 'vi-VN': 'Gợi ý cách đọc gần qing.', 'en-US': 'Hints at a qing-like pronunciation.' } },
    ],
  },
  清: {
    hanzi: '清', pinyin: 'qīng', meaning: { 'vi-VN': 'trong; sạch', 'en-US': 'clear; clean' }, familyId: 'qing',
    components: [
      { component: '氵', role: 'semantic', note: { 'vi-VN': 'Thường gợi ý nghĩa liên quan đến nước hoặc chất lỏng.', 'en-US': 'Often suggests a link to water or liquids.' } },
      { component: '青', role: 'phonetic', note: { 'vi-VN': 'Gợi ý cách đọc gần qing.', 'en-US': 'Hints at a qing-like pronunciation.' } },
    ],
  },
  好: { hanzi: '好', pinyin: 'hǎo', meaning: { 'vi-VN': 'tốt; khỏe (trong lời chào)', 'en-US': 'good; well (in greetings)' } },
  是: { hanzi: '是', pinyin: 'shì', meaning: { 'vi-VN': 'là', 'en-US': 'to be' } },
}

export const components: Record<string, { meaning: LocalizedText }> = {
  讠: { meaning: { 'vi-VN': 'lời nói', 'en-US': 'speech' } },
  忄: { meaning: { 'vi-VN': 'tâm trí, cảm xúc', 'en-US': 'mind, emotion' } },
  氵: { meaning: { 'vi-VN': 'nước', 'en-US': 'water' } },
  日: { meaning: { 'vi-VN': 'mặt trời, ngày', 'en-US': 'sun, day' } },
  青: { meaning: { 'vi-VN': 'gợi âm trong nhóm qing', 'en-US': 'sound clue in the qing family' } },
}

export const phoneticFamilies = {
  qing: {
    key: '青',
    members: ['请', '情', '清', '晴'],
    note: {
      'vi-VN': 'Cùng có 青. Phần bên trái gợi ý nhóm nghĩa; 青 là manh mối về âm đọc, không đảm bảo cùng thanh điệu.',
      'en-US': 'All contain 青. The left side hints at meaning; 青 offers a sound clue, not a guaranteed tone.',
    },
  },
} as const

export const words: Record<string, Word> = {
  wo: { id: 'wo', hanzi: '我', pinyin: 'wǒ', meaning: { 'vi-VN': 'tôi', 'en-US': 'I; me' } },
  jintian: { id: 'jintian', hanzi: '今天', pinyin: 'jīntiān', meaning: { 'vi-VN': 'hôm nay', 'en-US': 'today' } },
  xiawu: { id: 'xiawu', hanzi: '下午', pinyin: 'xiàwǔ', meaning: { 'vi-VN': 'buổi chiều', 'en-US': 'afternoon' } },
  xiang: { id: 'xiang', hanzi: '想', pinyin: 'xiǎng', meaning: { 'vi-VN': 'muốn; nghĩ', 'en-US': 'want; think' } },
  qu: { id: 'qu', hanzi: '去', pinyin: 'qù', meaning: { 'vi-VN': 'đi', 'en-US': 'go' } },
  xuexiao: {
    id: 'xuexiao', hanzi: '学校', pinyin: 'xuéxiào', meaning: { 'vi-VN': 'trường học', 'en-US': 'school' },
    note: { 'vi-VN': '学校 là một từ gồm hai chữ. 学 cũng xuất hiện trong 学习, 学生 và 大学.', 'en-US': '学校 is one word made of two characters. 学 also appears in 学习, 学生 and 大学.' },
  },
  xuexi: { id: 'xuexi', hanzi: '学习', pinyin: 'xuéxí', meaning: { 'vi-VN': 'học; học tập', 'en-US': 'study; learn' } },
  zhongwen: { id: 'zhongwen', hanzi: '中文', pinyin: 'Zhōngwén', meaning: { 'vi-VN': 'tiếng Trung', 'en-US': 'Chinese language' } },
  qing: { id: 'qing', hanzi: '请', pinyin: 'qǐng', meaning: { 'vi-VN': 'mời; xin', 'en-US': 'please; invite' } },
  ni: { id: 'ni', hanzi: '你', pinyin: 'nǐ', meaning: { 'vi-VN': 'bạn', 'en-US': 'you' } },
  he: { id: 'he', hanzi: '喝', pinyin: 'hē', meaning: { 'vi-VN': 'uống', 'en-US': 'drink' } },
  shui: { id: 'shui', hanzi: '水', pinyin: 'shuǐ', meaning: { 'vi-VN': 'nước', 'en-US': 'water' } },
  tianqi: { id: 'tianqi', hanzi: '天气', pinyin: 'tiānqì', meaning: { 'vi-VN': 'thời tiết', 'en-US': 'weather' } },
  qinglang: { id: 'qinglang', hanzi: '晴朗', pinyin: 'qínglǎng', meaning: { 'vi-VN': 'quang đãng', 'en-US': 'clear and bright' } },
  xuesheng: { id: 'xuesheng', hanzi: '学生', pinyin: 'xuéshēng', meaning: { 'vi-VN': 'học sinh; sinh viên', 'en-US': 'student' } },
  daxue: { id: 'daxue', hanzi: '大学', pinyin: 'dàxué', meaning: { 'vi-VN': 'đại học', 'en-US': 'university' } },
  zhongguo: { id: 'zhongguo', hanzi: '中国', pinyin: 'Zhōngguó', meaning: { 'vi-VN': 'Trung Quốc', 'en-US': 'China' } },
  qingwen: { id: 'qingwen', hanzi: '请问', pinyin: 'qǐngwèn', meaning: { 'vi-VN': 'xin hỏi', 'en-US': 'excuse me; may I ask' } },
  qingchu: { id: 'qingchu', hanzi: '清楚', pinyin: 'qīngchu', meaning: { 'vi-VN': 'rõ ràng', 'en-US': 'clear' } },
  xinqing: { id: 'xinqing', hanzi: '心情', pinyin: 'xīnqíng', meaning: { 'vi-VN': 'tâm trạng', 'en-US': 'mood' } },
  hao: { id: 'hao', hanzi: '好', pinyin: 'hǎo', meaning: { 'vi-VN': 'tốt; khỏe', 'en-US': 'good; well' } },
  shi: { id: 'shi', hanzi: '是', pinyin: 'shì', meaning: { 'vi-VN': 'là', 'en-US': 'to be' } },
}

export const sentences: Sentence[] = [
  {
    id: 'hello', tokens: ['ni', 'hao'], focusWordId: 'ni',
    translation: { 'vi-VN': 'Xin chào.', 'en-US': 'Hello.' },
    insight: { 'vi-VN': '你好 là lời chào quen thuộc. Trong lời nói tự nhiên, âm của 你 có thể đổi thanh do đứng trước một âm thanh 3 khác; Pinyin cơ bản vẫn viết nǐ hǎo.', 'en-US': '你好 is a common greeting. In natural speech, the tone of 你 may change before another third tone; its underlying Pinyin remains nǐ hǎo.' },
    focus: { 'vi-VN': 'Nghe hai âm tiết và nhận ra lời chào.', 'en-US': 'Hear two syllables and recognize a greeting.' },
  },
  {
    id: 'identity', tokens: ['wo', 'shi', 'xuesheng'], focusWordId: 'xuesheng',
    translation: { 'vi-VN': 'Tôi là học sinh hoặc sinh viên.', 'en-US': 'I am a student.' },
    insight: { 'vi-VN': '我是学生 gồm chủ ngữ 我, từ nối 是 và danh từ 学生. 学生 là một từ hai chữ, không nên tách thành hai nghĩa rời.', 'en-US': '我是学生 has the subject 我, linking word 是 and noun 学生. 学生 is one two-character word.' },
    focus: { 'vi-VN': 'Nhận ra mẫu “tôi là…” và một từ hai chữ.', 'en-US': 'Recognize “I am…” and a two-character word.' },
  },
  {
    id: 'study', tokens: ['wo', 'xuexi', 'zhongwen'], focusWordId: 'xuexi',
    translation: { 'vi-VN': 'Tôi học tiếng Trung.', 'en-US': 'I study Chinese.' },
    insight: { 'vi-VN': '我 / 学习 / 中文 gồm người làm, hành động và nội dung học. 学习 là một từ, 中文 là một từ.', 'en-US': '我 / 学习 / 中文 shows the learner, the action and the subject. 学习 and 中文 are each one word.' },
    focus: { 'vi-VN': 'Đọc câu theo mẫu người làm – hành động – nội dung.', 'en-US': 'Read the subject – action – object pattern.' },
  },
  {
    id: 'school',
    tokens: ['wo', 'jintian', 'xiawu', 'xiang', 'qu', 'xuexiao', 'xuexi', 'zhongwen'],
    focusWordId: 'xuexiao',
    translation: { 'vi-VN': 'Chiều nay tôi muốn đến trường học tiếng Trung.', 'en-US': 'I want to go to school to study Chinese this afternoon.' },
    insight: { 'vi-VN': 'Nhìn theo cụm: 我 / 今天下午 / 想 / 去学校 / 学习中文. Trong đó 学校 và 学习 là hai từ khác nhau cùng có 学.', 'en-US': 'Read in chunks: 我 / 今天下午 / 想 / 去学校 / 学习中文. 学校 and 学习 are different words sharing 学.' },
    focus: { 'vi-VN': 'Nhận ra ranh giới từ và mạng từ quanh 学.', 'en-US': 'Notice word boundaries and the network around 学.' },
  },
  {
    id: 'water',
    tokens: ['qing', 'ni', 'he', 'shui'],
    focusWordId: 'qing',
    translation: { 'vi-VN': 'Mời bạn uống nước.', 'en-US': 'Please have some water.' },
    insight: { 'vi-VN': '请 có 讠 gợi nghĩa liên quan đến lời nói và 青 gợi nhóm âm qing. Đây là manh mối, không phải công thức đoán đúng mọi chữ.', 'en-US': 'In 请, 讠 hints at speech and 青 hints at the qing sound family. These are clues, not rules that predict every character.' },
    focus: { 'vi-VN': 'Khám phá nhóm chữ cùng phần gợi âm 青.', 'en-US': 'Explore characters sharing the 青 sound clue.' },
  },
  {
    id: 'weather',
    tokens: ['jintian', 'tianqi', 'qinglang'],
    focusWordId: 'qinglang',
    translation: { 'vi-VN': 'Hôm nay thời tiết quang đãng.', 'en-US': 'The weather is clear today.' },
    insight: { 'vi-VN': '晴 cũng có 青 như 请, nhưng nghĩa liên quan đến thời tiết. 日 giúp gợi hướng nghĩa đó.', 'en-US': '晴 shares 青 with 请, but relates to weather. 日 offers a clue to that meaning.' },
    focus: { 'vi-VN': 'So sánh gợi nghĩa và gợi âm trong 晴.', 'en-US': 'Compare the meaning and sound clues in 晴.' },
  },
]

export function sentenceHanzi(sentence: Sentence): string {
  return sentence.tokens.map((id) => words[id].hanzi).join('') + '。'
}

export function relatedWords(hanzi: string, excludeId?: string): Word[] {
  return Object.values(words)
    .filter((word) => word.id !== excludeId && [...hanzi].some((character) => word.hanzi.includes(character)))
    .slice(0, 6)
}
