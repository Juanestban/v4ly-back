import fs from 'node:fs'

export const readdir = (path) => {
  const files = fs.readdirSync(path)
  const mp4Files = files.filter((file) => file.endsWith('.mp4'))

  return mp4Files
}
