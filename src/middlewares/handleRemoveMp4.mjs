import fs from 'node:fs'
import dotenv from 'dotenv'

import { env } from '../environments/env.mjs'
import { bytesToMb } from '../utils/bytesToMb.mjs'
import { getNewPath } from '../utils/path.mjs'
import { readdir } from '../utils/readdir.mjs'
import { PUBLIC_FOLDER } from '../constants/staticFolders.constants.mjs'

dotenv.config()

export const handleRemoveMp4 = async (req, res, next) => {
  const publicPath = getNewPath(PUBLIC_FOLDER)
  const mp4Files = readdir(publicPath)
  let sizeFolder = 0

  mp4Files.forEach((mp4) => {
    sizeFolder += bytesToMb(getNewPath(publicPath, mp4))
  })

  if (sizeFolder < env.maxDiskSpace) {
    return next()
  }

  const promise = mp4Files.map(
    (mp4) =>
      new Promise((resolve, reject) => {
        fs.rm(getNewPath(publicPath, mp4), (error) => {
          if (error) {
            reject(error)
          }

          resolve()
        })
      }),
  )

  await Promise.allSettled(promise)
  return next()
}
