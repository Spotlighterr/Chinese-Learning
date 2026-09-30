import assert from 'node:assert/strict'
import { once } from 'node:events'
import { test } from 'node:test'
import { createApp } from './app.ts'
import { createStore } from './db.ts'
import type { Progress } from './db.ts'

const json = <T>(response: Response) => response.json() as Promise<T>

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
    })

    const post = (path: string, body: object) => fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify(body),
    })

    const savedResponse = await post('/api/progress/words', { wordId: 'xuexiao', saved: true })
    assert.equal(savedResponse.status, 200)
    assert.deepEqual((await json<Progress>(savedResponse)).savedWordIds, ['xuexiao'])

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

    const invalidResponse = await post('/api/progress/words', { wordId: 'not-seed-content', saved: true })
    assert.equal(invalidResponse.status, 400)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
    store.close()
  }
})
