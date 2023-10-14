import { Router } from 'express'

import { youtubeController } from '../controllers/youtube.controller.mjs'
import { handleRemoveMp4 } from '../middlewares/handleRemoveMp4.mjs'

const router = Router()

router.post('/full', handleRemoveMp4, youtubeController.downloadVideoAudio)
router.post('/video', youtubeController.downloadOnlyVideo)
router.post('/audio', youtubeController.downloadOnlyAudio)

export const youtubeRouter = router
