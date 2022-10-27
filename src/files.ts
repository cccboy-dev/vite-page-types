import { dirname, extname } from 'path'
import { existsSync } from 'fs'
import { slash } from '@antfu/utils'
import fg from 'fast-glob'

import type { PageOptions } from './types'

/**
 * Resolves the page dirs for its for its given globs
 */
export function getPageOptions(PageOptions: PageOptions, root: string, exclude: string[], configFileName: string): PageOptions[] {
  const pathArr = fg.sync(slash(PageOptions.path), {
    ignore: exclude,
    // onlyDirectories: true,
    dot: true,
    unique: true,
    cwd: root,
  })
  const allPathOptions: PageOptions[] = pathArr.map((v) => {
    let filename = v.split('/').pop() || ''
    const extName = extname(filename)

    filename = filename.replace(extName, '')
    const configPath = `${dirname(v)}/${configFileName.replace('[name]', filename)}.ts`

    const isConfigExists = existsSync(configPath)

    return { ...PageOptions, path: v, dir: dirname(v), config: isConfigExists ? configPath : undefined }
  })

  return allPathOptions
}

