import fs from 'node:fs'

export const bytesToMb = (path) => {
  const MEGABYTE_TO_BYTES = 1024 * 1024
  const stats = fs.statSync(path)
  const sizeInBytes = stats.size

  return sizeInBytes / MEGABYTE_TO_BYTES
}
