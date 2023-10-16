import youtubedl from 'youtube-dl-exec'

import { YoutubeDL } from './youtubeDL.controller.mjs'
import { env } from '../environments/env.mjs'

export class youtubeController {
  static async downloadVideoAudio(req, res) {
    const { body } = req
    const { url, filename, resolution } = body

    try {
      const { title, formats } = await youtubedl(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
      })
      const _youtubedl = new YoutubeDL(title, formats, resolution)
      _youtubedl.filename = filename
      await _youtubedl.download()

      const link = `${env.baseUrl}/api/yt/download/${_youtubedl.finalFilename}`
      return res.status(200).json({ filename: _youtubedl.finalFilename, link }).end()
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  static async downloadOnlyVideo(req, res) {
    return res.status(200).json({ status: 'working on that' }).end()
  }

  static async downloadOnlyAudio(req, res) {
    return res.status(200).json({ status: 'working on that' }).end()
  }
}
