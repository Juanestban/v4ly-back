import fs from 'node:fs'
import youtubedl from 'youtube-dl-exec'
import ffmpeg from 'fluent-ffmpeg'

import { PUBLIC_FOLDER } from '../constants/index.mjs'
import { getNewPath } from '../utils/path.mjs'

export class YoutubeDL {
  #title = ''
  #filename = undefined
  #formats = []
  #resolution = 720
  #video = undefined
  #audio = undefined
  #output = undefined

  constructor(title, formats = [], resolution) {
    this.#title = title
    this.#formats = formats
    this.#resolution = parseInt(resolution) ?? 720
  }

  get filename() {
    return this.#filename
  }

  set filename(newFilename) {
    this.#filename = newFilename
  }

  get output() {
    return this.#output
  }

  set output(newOutput) {
    this.#output = newOutput
  }

  findVideo() {
    const avalaibleFormats = this.#formats.filter(
      (format) => format.ext === 'mp4' && format.format_note !== 'none',
    )
    const sorted = avalaibleFormats.sort((a, b) => a.height - b.height)
    const video = sorted.find((format) => format.height >= parseInt(this.#resolution))
    this.#video = video.url
  }

  findAudio() {
    const availableFormats = this.#formats.filter(
      (format) => format.ext === 'm4a' && format.format_note !== 'none',
    )
    const sorted = availableFormats.sort((a, b) => b.abr - a.abr)
    const audio = sorted[0]
    this.#audio = audio.url
  }

  findVideoAudio() {
    this.findVideo()
    this.findAudio()
  }

  download() {
    this.findVideoAudio()
    return new Promise((resolve, reject) => {
      this.#output = getNewPath(
        PUBLIC_FOLDER,
        `${this.#filename ?? this.#title}__${this.#resolution}p.mp4`,
      )
      const publicPath = getNewPath(PUBLIC_FOLDER)

      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath)
      }

      const command = ffmpeg()
        .input(this.#video)
        .input(this.#audio)
        .videoCodec('copy')
        .audioCodec('copy')
        .on('start', () => {
          console.log(`☣ started download video & audio`)
        })
        .on('progress', (progress) => {
          console.log(`⬇️ downloading ${progress.percent.toFixed(2)}%`)
        })
        .on('end', () => {
          console.log('✅ downloaded successfully!')
          resolve(this.#output)
        })
        .on('error', (err) => {
          reject(err)
        })
        .save(this.#output)
      command.run()
    })
  }
}

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
      const output = await _youtubedl.download()

      return res.status(200).json({ title, output }).end()
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
