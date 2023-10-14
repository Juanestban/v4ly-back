import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import * as dotenv from 'dotenv'

import { ORIGIN, SELF_PORT, PORT } from './constants/index.mjs'
import { router } from './routers/index.mjs'

const app = express()

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors({ origin: ORIGIN }))

app.set(SELF_PORT, PORT)

app.get('/', (_, res) => res.send('<h1>Hello, world!</h1>').end())
app.use('/public', express.static('public'))
app.use('/api', router)

app.listen(PORT, () => {
  console.log('[+] listen on port', PORT)
  console.log('url:', `http://localhost:${PORT}`)
})
