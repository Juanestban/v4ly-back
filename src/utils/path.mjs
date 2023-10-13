import path from 'node:path'

export const pathRoot = path.resolve(process.cwd())

export const getNewPath = (...args) => path.resolve(pathRoot, ...args)
