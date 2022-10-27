import { slash, toArray } from '@antfu/utils'
import type { PageOptions } from '../types/types'
import { getPageOptions } from './files'

import { MODULE_IDS } from './constants'
import type { ResolvedOptions, UserOptions } from './types'

function resolvePageOptions(rules: UserOptions['include'], root: string, exclude: string[], configFileName: string): ResolvedOptions['path'] {
  rules = toArray(rules)
  return rules.flatMap((rule) => {
    const option: PageOptions = typeof rule === 'string'
      ? { path: rule, dir: '' }
      : rule

    return getPageOptions(option, root, exclude, configFileName)
  })
}

export function resolveOptions(userOptions: UserOptions, viteRoot?: string): ResolvedOptions {
  const {
    include = userOptions.include || ['src/pages/**/index.{vue,tsx,jsx}'],
    exclude = ['node_modules', '.git', '**/__*__/**'],
    configFileName = '[name].pageconfig',
  } = userOptions

  const root = viteRoot || slash(process.cwd())

  const resolvedPageOptions = resolvePageOptions(include, root, exclude, configFileName)

  const moduleIds = userOptions.moduleId
    ? [userOptions.moduleId]
    : MODULE_IDS

  const resolvedOptions: ResolvedOptions = {
    path: resolvedPageOptions,
    moduleIds,
    root,
    exclude,
    configFileName,
  }

  return resolvedOptions
}
