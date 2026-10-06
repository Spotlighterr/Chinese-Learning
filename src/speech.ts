export function speakChinese(text: string): boolean {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.85
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith('zh'))
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
  return true
}
