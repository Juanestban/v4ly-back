import dotenv from 'dotenv'

dotenv.config()

const isDevelopment = process.env.NODE_ENV === 'development'

export const env = {
  isDevelopment,
  frontend: process.env.FRONTEND_URL,
  baseUrl: process.env.BACKEND_URL,
  maxDiskSpace: process.env.MAX_DISK_SPACE,
}
