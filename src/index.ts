import type { Plugin } from 'vite'
import { MODULE_ID_VIRTUAL } from './constants'
import { PageContext } from './context'

import { definePage, parsePageRequest } from './utils'
import type { UserOptions } from './types'

function pageTypesPlugin(userOptions: UserOptions = {}): Plugin {
  let ctx: PageContext

  return {
    name: 'vite-plugin-page-types',
    enforce: 'pre',
    async configResolved(config) {
      ctx = new PageContext(userOptions, config.root)
      ctx.setLogger(config.logger)
      await ctx.searchGlob()
    },
    api: {
      getComputedPageTypes() {
        ctx.getComputedPageTypes()
      },
    },
    configureServer(server) {
      ctx.setupViteServer(server)
    },
    resolveId(id) {
      if (ctx.options.moduleIds.includes(id))
        return `${MODULE_ID_VIRTUAL}?id=${id}`

      return null
    },
    async load(id) {
      const {
        moduleId,
        pageId,
      } = parsePageRequest(id)

      if (moduleId === MODULE_ID_VIRTUAL && pageId && ctx.options.moduleIds.includes(pageId))
        return ctx.resolvePageTypes()

      return null
    },
  }
}

export * from './types'

export { PageContext, definePage }

export default pageTypesPlugin
