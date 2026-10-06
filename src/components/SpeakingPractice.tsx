import { useEffect, useRef, useState } from 'react'
import type { Locale } from '../data/curriculum'
import { contentMatch } from '../speaking-score'
import { speakChinese } from '../speech'

type RecognitionResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> }
type RecognitionErrorEvent = { error: string }
type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean
  onresult: ((event: RecognitionResultEvent) => void) | null
  onerror: ((event: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void; stop: () => void
}
type RecognitionConstructor = new () => Recognition
type SpeechWindow = Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor }

const copy = {
  'vi-VN': { title: 'Nghe và đọc theo', listen: 'Nghe mẫu', record: 'Bắt đầu ghi âm', stop: 'Dừng và chấm', replay: 'Nghe lại giọng mình', target: 'Câu mẫu', heard: 'Máy nghe được', match: 'Độ khớp nội dung', caveat: 'Điểm dựa trên chữ máy nhận dạng được; chưa đánh giá thanh điệu, âm đầu hay độ tự nhiên.', unsupported: 'Trình duyệt này chưa hỗ trợ nhận dạng tiếng Trung. Bạn vẫn có thể ghi âm và nghe lại.', microphone: 'Cần cho phép dùng micro để ghi âm.', noSpeech: 'Chưa nhận dạng được lời nói. Thử nói rõ hơn hoặc dùng trình duyệt hỗ trợ nhận dạng tiếng Trung.', graph: 'Đồ thị âm thanh', pitch: 'Cao độ ước tính', graphHint: 'Cột thể hiện độ lớn; đường thể hiện cao độ ước tính ở đoạn có giọng. Chưa dùng đồ thị này để chấm thanh điệu.', secure: 'Micro cần localhost hoặc kết nối HTTPS.', unavailable: 'Thiết bị này chưa hỗ trợ ghi âm.', pronunciation: 'Pinyin', },
  'en-US': { title: 'Listen and speak', listen: 'Hear model', record: 'Start recording', stop: 'Stop and check', replay: 'Play my recording', target: 'Target sentence', heard: 'Recognized speech', match: 'Content match', caveat: 'This score compares recognized characters. It does not assess tones, initials, or naturalness.', unsupported: 'Chinese speech recognition is unavailable in this browser. You can still record and replay.', microphone: 'Allow microphone access to record.', noSpeech: 'Speech was not recognized. Try speaking clearly or use a browser with Chinese recognition.', graph: 'Audio graph', pitch: 'Estimated pitch', graphHint: 'Bars show loudness; the line estimates pitch in voiced sections. This does not grade tones.', secure: 'Microphone access needs localhost or HTTPS.', unavailable: 'Recording is unavailable on this device.', pronunciation: 'Pinyin', },
} as const

async function audioAnalysis(blob: Blob): Promise<{ peaks: number[]; pitch: Array<number | null> }> {
  const context = new AudioContext()
  try {
    const buffer = await context.decodeAudioData(await blob.arrayBuffer())
    const data = buffer.getChannelData(0)
    const bars = 80, step = Math.max(1, Math.floor(data.length / bars))
    const peaks = Array.from({ length: bars }, (_, index) => {
      let total = 0
      const start = index * step, end = Math.min(data.length, start + step)
      for (let i = start; i < end; i++) total += data[i] * data[i]
      return Math.min(1, Math.sqrt(total / Math.max(1, end - start)) * 4)
    })
    const stride = Math.max(1, Math.round(buffer.sampleRate / 11025))
    const sampleRate = buffer.sampleRate / stride
    const pitch = Array.from({ length: bars }, (_, index) => {
      const center = Math.floor((index + 0.5) * data.length / bars)
      const frame = new Float32Array(1024)
      for (let i = 0; i < frame.length; i++) frame[i] = data[Math.min(data.length - 1, Math.max(0, center + (i - 512) * stride))]
      let energy = 0
      for (const value of frame) energy += value * value
      if (Math.sqrt(energy / frame.length) < 0.018) return null
      let bestLag = 0, bestCorrelation = 0
      const minLag = Math.floor(sampleRate / 450), maxLag = Math.ceil(sampleRate / 75)
      for (let lag = minLag; lag <= maxLag; lag++) {
        let sum = 0, left = 0, right = 0
        for (let i = 0; i < 512; i++) {
          const a = frame[i + 128], b = frame[i + 128 + lag]
          sum += a * b; left += a * a; right += b * b
        }
        const correlation = sum / Math.sqrt(left * right || 1)
        if (correlation > bestCorrelation) { bestCorrelation = correlation; bestLag = lag }
      }
      return bestCorrelation > 0.72 && bestLag ? sampleRate / bestLag : null
    })
    return { peaks, pitch }
  } finally { await context.close() }
}

export function SpeakingPractice({ locale, hanzi, pinyin }: { locale: Locale; hanzi: string; pinyin: string }) {
  const labels = copy[locale]
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [peaks, setPeaks] = useState<number[]>([])
  const [pitch, setPitch] = useState<Array<number | null>>([])
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [recognitionAvailable, setRecognitionAvailable] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<Recognition | null>(null)
  const audioUrlRef = useRef<string | null>(null)

  useEffect(() => {
    const browser = window as SpeechWindow
    setRecognitionAvailable(Boolean(browser.SpeechRecognition ?? browser.webkitSpeechRecognition))
    return () => {
      recognitionRef.current?.stop()
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
      audioUrlRef.current && URL.revokeObjectURL(audioUrlRef.current)
    }
  }, [])

  function playModel() {
    if (!speakChinese(hanzi)) setError(labels.unavailable)
  }

  async function start() {
    setError(''); setTranscript(''); setPeaks([]); setPitch([])
    if (!navigator.mediaDevices?.getUserMedia) { setError(window.isSecureContext ? labels.unavailable : labels.secure); return }
    if (!('MediaRecorder' in window)) { setError(labels.unavailable); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const chunks: BlobPart[] = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
        const url = URL.createObjectURL(blob)
        audioUrlRef.current = url; setAudioUrl(url)
        try { const analysis = await audioAnalysis(blob); setPeaks(analysis.peaks); setPitch(analysis.pitch) } catch { setPeaks([]); setPitch([]) }
        setRecording(false)
      }
      recorderRef.current = recorder
      recorder.start()
      const browser = window as SpeechWindow
      const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition
      if (Constructor) {
        const recognizer = new Constructor()
        recognizer.lang = 'zh-CN'; recognizer.continuous = false; recognizer.interimResults = false
        recognizer.onresult = (event) => setTranscript(event.results[0]?.[0]?.transcript ?? '')
        recognizer.onerror = (event) => { if (event.error !== 'no-speech' && event.error !== 'aborted') setError(labels.noSpeech) }
        recognizer.onend = () => { recognitionRef.current = null }
        recognitionRef.current = recognizer
        try { recognizer.start() } catch { recognitionRef.current = null; setError(labels.unsupported) }
      }
      setRecording(true)
    } catch { setError(labels.microphone) }
  }

  function stop() {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    recognitionRef.current?.stop()
  }

  const score = recording || !audioUrl ? null : contentMatch(hanzi, transcript)
  return <section className="speaking-card" aria-label={labels.title}>
    <div className="speaking-heading"><div><span className="eyebrow">{labels.title}</span><h3 lang="zh-Hans">{hanzi}</h3><p>{labels.pronunciation}: {pinyin}</p></div><button className="secondary-button" onClick={playModel}>🔊 {labels.listen}</button></div>
    <div className="speaking-actions"><button className="primary-button" onClick={recording ? stop : start}>{recording ? labels.stop : labels.record}</button>{audioUrl && !recording && <audio controls src={audioUrl} aria-label={labels.replay} />}</div>
    {error && <p className="error-message" role="alert">{error}</p>}
    {!recognitionAvailable && <p className="speaking-note">{labels.unsupported}</p>}
    {peaks.length > 0 && <div className="waveform-wrap"><span className="eyebrow">{labels.graph}</span><svg className="waveform" viewBox="0 0 800 110" role="img" aria-label={labels.graph} preserveAspectRatio="none">{peaks.map((peak, index) => <rect key={index} x={index * 10 + 2} y={55 - Math.max(2, peak * 51)} width="6" height={Math.max(4, peak * 102)} />)}{pitch.map((value, index) => value && pitch[index + 1] ? <line key={index} x1={index * 10 + 5} y1={100 - 75 * Math.log2(value / 75) / Math.log2(450 / 75)} x2={(index + 1) * 10 + 5} y2={100 - 75 * Math.log2(pitch[index + 1]! / 75) / Math.log2(450 / 75)} /> : null)}</svg><small>{labels.graphHint}</small></div>}
    {audioUrl && !recording && <div className="speaking-result"><span>{labels.target}: <strong lang="zh-Hans">{hanzi}</strong></span>{transcript ? <><span>{labels.heard}: <strong lang="zh-Hans">{transcript}</strong></span><strong>{labels.match}: {score}/100</strong><small>{labels.caveat}</small></> : recognitionAvailable && <span>{labels.noSpeech}</span>}</div>}
  </section>
}
