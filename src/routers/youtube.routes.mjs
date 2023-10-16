import { Router } from 'express'

import { youtubeController } from '../controllers/youtube.controller.mjs'
import { handleRemoveMp4 } from '../middlewares/handleRemoveMp4.mjs'
import { getNewPath } from '../utils/path.mjs'

const router = Router()

router.get('/download/:filename', (req, res) => {
  const { params } = req
  const { filename } = params
  const file = `public/${filename}`

  return res.download(getNewPath(file))
})
router.post('/full', handleRemoveMp4, youtubeController.downloadVideoAudio)
router.post('/video', youtubeController.downloadOnlyVideo)
router.post('/audio', youtubeController.downloadOnlyAudio)

export const youtubeRouter = router
