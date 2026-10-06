import assert from 'node:assert/strict'
import { once } from 'node:events'
import { test } from 'node:test'
import { createApp } from './app.ts'
import { createStore } from './db.ts'
import type { Progress } from './db.ts'
import { contentMatch } from '../src/speaking-score.ts'

const json = <T>(response: Response) => response.json() as Promise<T>

test('speech content score compares recognized Hanzi and ignores punctuation', () => {
  assert.equal(contentMatch('请你喝水。', '请你喝水'), 100)
  assert.equal(contentMatch('请你喝水。', '请喝水'), 75)
  assert.equal(contentMatch('请你喝水。', ''), null)
})

test('anonymous learner progress persists across API requests and segmentation is scored on the server', async () => {
  const store = createStore(':memory:')
  const server = createApp(store).listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  assert.ok(address && typeof address !== 'string')
  const base = `http://127.0.0.1:${address.port}`

  try {
    const initialResponse = await fetch(`${base}/api/progress`)
    assert.equal(initialResponse.status, 200)
    const cookie = initialResponse.headers.get('set-cookie')?.split(';')[0]
    assert.ok(cookie?.startsWith('decoder_session='))
    assert.deepEqual(await initialResponse.json(), {
      completedSentenceIds: [], savedWordIds: [], attemptsCount: 0, bestBySentence: {},
      profile: null, completedLessonIds: [], exerciseAttemptsCount: 0, dueReviewCount: 0,
    })

    const post = (path: string, body: object) => fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify(body),
    })

    const savedResponse = await post('/api/progress/words', { wordId: 'xuexiao', saved: true })
    assert.equal(savedResponse.status, 200)
    assert.deepEqual((await json<Progress>(savedResponse)).savedWordIds, ['xuexiao'])
    const dueResponse = await fetch(`${base}/api/reviews/due`, { headers: { Cookie: cookie } })
    assert.deepEqual(await dueResponse.json(), { wordIds: ['xuexiao'] })
    const reviewResponse = await post('/api/reviews', { wordId: 'xuexiao', rating: 'good' })
    assert.equal(reviewResponse.status, 200)
    assert.deepEqual((await json<{ wordIds: string[] }>(reviewResponse)).wordIds, [])

    const profile = { level: 'new', targetHsk: 1, targetDate: '2027-01-01', dailyMinutes: 30, handwriting: false, explanationLocale: 'vi-VN' }
    const profileResponse = await post('/api/profile', profile)
    assert.equal(profileResponse.status, 200)
    assert.deepEqual((await json<Progress>(profileResponse)).profile, profile)
    assert.equal((await post('/api/profile', { ...profile, dailyMinutes: 0 })).status, 400)

    for (const [exerciseId, answer] of [['school-meaning', 0], ['study-pinyin', 1], ['water-order', ['qing', 'ni', 'he', 'shui']]] as const) {
      const response = await post('/api/exercises', { lessonId: 'see-words', exerciseId, answer })
      assert.equal(response.status, 200)
      assert.equal((await json<{ correct: boolean }>(response)).correct, true)
    }

    const completedResponse = await post('/api/progress/sentences', { sentenceId: 'school' })
    assert.equal(completedResponse.status, 200)
    assert.deepEqual((await json<Progress>(completedResponse)).completedSentenceIds, ['school'])

    const attemptResponse = await post('/api/progress/segmentation', { sentenceId: 'water', positions: [1, 3] })
    assert.equal(attemptResponse.status, 200)
    const attempt = await json<{ result: unknown }>(attemptResponse)
    assert.deepEqual(attempt.result, { correct: 2, extra: 0, missing: 1, total: 3, perfect: false, expected: [1, 2, 3] })

    const perfectResponse = await post('/api/progress/segmentation', { sentenceId: 'water', positions: [1, 2, 3] })
    assert.equal((await json<{ result: { perfect: boolean } }>(perfectResponse)).result.perfect, true)

    const reloadedResponse = await fetch(`${base}/api/progress`, { headers: { Cookie: cookie } })
    const reloaded = await json<Progress>(reloadedResponse)
    assert.deepEqual(reloaded.savedWordIds, ['xuexiao'])
    assert.deepEqual(reloaded.completedSentenceIds, ['school'])
    assert.equal(reloaded.attemptsCount, 2)
    assert.deepEqual(reloaded.bestBySentence.water, { correct: 3, extra: 0, total: 3 })
    assert.deepEqual(reloaded.completedLessonIds, ['see-words'])
    assert.equal(reloaded.exerciseAttemptsCount, 3)

    const invalidResponse = await post('/api/progress/words', { wordId: 'not-seed-content', saved: true })
    assert.equal(invalidResponse.status, 400)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
    store.close()
  }
})
