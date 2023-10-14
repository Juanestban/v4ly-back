import fs from 'node:fs'
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
  #finalFilename = undefined

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

  get finalFilename() {
    return this.#finalFilename
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
    this.#finalFilename = `${this.#filename ?? this.#title}__${this.#resolution}p.mp4`

    return new Promise((resolve, reject) => {
      this.#output = getNewPath(PUBLIC_FOLDER, this.#finalFilename)
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
          const percent = progress.percent.toFixed(2)
          console.log(`⬇️ downloading ${percent}%`)
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
