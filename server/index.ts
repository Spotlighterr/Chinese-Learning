import { resolve } from 'node:path'
import { createApp } from './app.ts'
import { createStore } from './db.ts'

const port = Number(process.env.PORT ?? 3001)
const databasePath = process.env.DATABASE_PATH ?? resolve(process.cwd(), '.data', 'chinese-decoder.sqlite')
const store = createStore(databasePath)
const app = createApp(store, true)

app.listen(port, () => {
  console.log(`Chinese Decoder API listening on http://localhost:${port}`)
})
