import { Router } from 'express'

import { youtubeRouter } from './youtube.routes.mjs'

const router = Router()

router.get('/', (_, res) => res.status(200).json({ message: 'Hello, world!' }).end())

router.use('/yt', youtubeRouter)

export { router }
