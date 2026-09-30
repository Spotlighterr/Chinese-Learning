import { randomBytes } from 'node:crypto'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import express from 'express'
import type { Request, Response } from 'express'
import { sentences, words } from '../src/data/curriculum.ts'
import type { Store } from './db.ts'
import { analyzeSegmentation } from './segmentation.ts'

const cookieName = 'decoder_session'

function sessionId(req: Request, res: Response, store: Store): string {
  const cookie = req.headers.cookie?.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1)
  if (cookie && /^[a-f0-9]{48}$/.test(cookie) && store.hasSession(cookie)) return cookie

  const id = randomBytes(24).toString('hex')
  store.createSession(id)
  res.cookie(cookieName, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })
  return id
}

export function createApp(store: Store, serveClient = false) {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '8kb' }))

  app.get('/api/health', (_req, res) => res.json({ ok: true }))
  app.get('/api/progress', (req, res) => {
    res.json(store.progress(sessionId(req, res, store)))
  })
  app.post('/api/progress/words', (req, res) => {
    const { wordId, saved } = req.body ?? {}
    if (typeof wordId !== 'string' || !Object.hasOwn(words, wordId) || typeof saved !== 'boolean') {
      return res.status(400).json({ error: 'invalid_word' })
    }
    const id = sessionId(req, res, store)
    store.setWord(id, wordId, saved)
    return res.json(store.progress(id))
  })
  app.post('/api/progress/sentences', (req, res) => {
    const { sentenceId } = req.body ?? {}
    if (typeof sentenceId !== 'string' || !sentences.some((sentence) => sentence.id === sentenceId)) {
      return res.status(400).json({ error: 'invalid_sentence' })
    }
    const id = sessionId(req, res, store)
    store.completeSentence(id, sentenceId)
    return res.json(store.progress(id))
  })
  app.post('/api/progress/segmentation', (req, res) => {
    const { sentenceId, positions } = req.body ?? {}
    if (typeof sentenceId !== 'string' || !Array.isArray(positions)) {
      return res.status(400).json({ error: 'invalid_segmentation' })
    }
    const result = analyzeSegmentation(sentenceId, positions)
    if (!result) return res.status(400).json({ error: 'invalid_segmentation' })
    const id = sessionId(req, res, store)
    store.addAttempt(id, sentenceId, result.correct, result.extra, result.total)
    return res.json({ result, progress: store.progress(id) })
  })

  app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }))

  if (serveClient) {
    const dist = resolve(process.cwd(), 'dist')
    if (existsSync(dist)) {
      app.use(express.static(dist))
      app.use((req, res, next) => {
        if (req.method !== 'GET') return next()
        return res.sendFile(resolve(dist, 'index.html'))
      })
    }
  }
  return app
}
