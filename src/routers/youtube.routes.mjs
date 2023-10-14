import { Router } from 'express'

import { youtubeController } from '../controllers/youtube.controller.mjs'

const router = Router()

router.post('/full', youtubeController.downloadVideoAudio)
router.post('/video', youtubeController.downloadOnlyVideo)
router.post('/audio', youtubeController.downloadOnlyAudio)

export const youtubeRouter = router
