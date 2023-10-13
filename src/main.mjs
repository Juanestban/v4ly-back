import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import * as dotenv from 'dotenv'

import { ORIGIN } from './constants/index.mjs'
import { router } from './routers/index.mjs'

const app = express()
// move this constant to environment like development
const port = 3200

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors({ origin: ORIGIN }))

app.get('/', (_, res) => res.send('<h1>Hello, world!</h1>').end())
app.use('/api', router)

app.listen(port, () => {
  console.log('[+] listen on port', port)
  console.log('url:', `http://localhost:${port}`)
})
