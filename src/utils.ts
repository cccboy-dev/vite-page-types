import { dirname, resolve } from 'path'
import { URLSearchParams } from 'url'
import fg from 'fast-glob'
import Debug from 'debug'
import { slash } from '@antfu/utils'
import type { ModuleNode, ViteDevServer } from 'vite'
import { MODULE_ID_VIRTUAL, countSlashRE } from './constants'

import type { PageConfig, PageOptions, ResolvedOptions } from './types'

export const debug = {
  hmr: Debug('vite-plugin-pages:hmr'),
  options: Debug('vite-plugin-pages:options'),
  pages: Debug('vite-plugin-pages:pages'),
  search: Debug('vite-plugin-pages:search'),
  env: Debug('vite-plugin-pages:env'),
  cache: Debug('vite-plugin-pages:cache'),
}

export function extsToGlob(extensions: string[]) {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

export function countSlash(value: string) {
  return (value.match(countSlashRE) || []).length
}

export function isTarget(path: string, options: ResolvedOptions) {
  for (const page of options.path) {
    const dirPath = slash(resolve(options.root, page.dir))
    if (path.startsWith(dirPath))
      return true
  }
  return false
}

export function invalidatePagesModule(server: ViteDevServer) {
  const { moduleGraph } = server
  const mods = moduleGraph.getModulesByFile(MODULE_ID_VIRTUAL)
  if (mods) {
    const seen = new Set<ModuleNode>()
    mods.forEach((mod) => {
      moduleGraph.invalidateModule(mod, seen)
    })
  }
}

export function parsePageRequest(id: string) {
  const [moduleId, rawQuery] = id.split('?', 2)
  const query = new URLSearchParams(rawQuery)
  const pageId = query.get('id')
  return {
    moduleId,
    query,
    pageId,
  }
}

export function getPageOptions(PageOptions: PageOptions, root: string, exclude: string[]): PageOptions[] {
  const pathArr = fg.sync(slash(PageOptions.path), {
    ignore: exclude,
    // onlyDirectories: true,
    dot: true,
    unique: true,
    cwd: root,
  })
  const allPathOptions: PageOptions[] = pathArr.map((v) => {
    return { ...PageOptions, path: v, dir: dirname(v) }
  })

  return allPathOptions
}

export function definePage(options: PageConfig): PageConfig {
  return options
}
