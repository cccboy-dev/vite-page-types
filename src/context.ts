import { resolve } from 'path'
import type { FSWatcher } from 'fs'
import { slash, toArray } from '@antfu/utils'
import type { Logger, ViteDevServer } from 'vite'
import { resolveOptions } from './options'
import { debug, invalidatePagesModule, isTarget } from './utils'

import type { PageOptions, ResolvedOptions, UserOptions } from './types'
import { replaceConfigImport } from './core/collect'

export interface PageRoute {
  path: string
  route: string
}

export class PageContext {
  private _server: ViteDevServer | undefined
  private _pageOptionMap = new Map<string, PageOptions>()

  rawOptions: UserOptions
  root: string
  options: ResolvedOptions
  logger?: Logger

  constructor(userOptions: UserOptions, viteRoot: string = process.cwd()) {
    this.rawOptions = userOptions
    this.root = slash(viteRoot)
    debug.env('root', this.root)
    this.options = resolveOptions(userOptions, this.root)
    debug.options(this.options)
  }

  setLogger(logger: Logger) {
    this.logger = logger
  }

  setupViteServer(server: ViteDevServer) {
    if (this._server === server)
      return

    this._server = server
    this.setupWatcher(server.watcher)
  }

  setupWatcher(watcher: FSWatcher) {
    watcher
      .on('unlink', async (path) => {
        path = slash(path)
        if (!isTarget(path, this.options))
          return
        await this.removePage(path)
        this.onUpdate()
      })
    watcher
      .on('add', async (path) => {
        path = slash(path)
        if (!isTarget(path, this.options))
          return
        const page = this.options.path.find(i => path.startsWith(slash(resolve(this.root, i.path))))!
        await this.addPage(path, page)
        this.onUpdate()
      })

    watcher
      .on('change', async (path) => {
        path = slash(path)
        if (!isTarget(path, this.options))
          return
        const page = this._pageOptionMap.get(path)
        this.logger?.info(`page changed : ${JSON.stringify(page || {})}`)
        // if (page)
        // await this.options.resolver.hmr?.changed?.(this, path)
      })
  }

  async addPage(path: string | string[], pageOption: PageOptions) {
    debug.pages('add', path)
    for (const p of toArray(path)) {
      this.pageOptionMap.set(p, {
        ...pageOption,
        path: p,
      })
      // await this.options.resolver.hmr?.added?.(this, p)
    }
  }

  async removePage(path: string) {
    debug.pages('remove', path)
    this.pageOptionMap.delete(path)
    // await this.options.resolver.hmr?.removed?.(this, path)
  }

  onUpdate() {
    if (!this._server)
      return

    invalidatePagesModule(this._server)
    debug.hmr('Reload generated pages.')
    this._server.ws.send({
      type: 'full-reload',
    })
  }

  async getComputedPageTypes() {
    debug.pages({ type: 'getComputedPageTypes', value: this.pageOptionMap })

    // const pageRoutes = [...this.pageRouteMap.values()]
  }

  async resolvePageTypes() {
    debug.pages({ type: 'resolvePageTypes', value: this.pageOptionMap })

    setTimeout(() => {
      replaceConfigImport(this.options.path[0], this.root)
    }, 1300)
    // const values = [...this.pageRouteMap.values()]
    // console.log(values)
    return 'export const msg = 111'
  }

  async searchGlob() {
    const pageDirFiles = this.options.path.map((page) => {
      const filepath = slash(resolve(this.options.root, page.path))
      debug.search(page.path, filepath)
      return {
        ...page,
        file: filepath,
      }
    })

    for (const page of pageDirFiles)
      await this.addPage(page.file, page)

    debug.cache(this.pageOptionMap)
  }

  get debug() {
    return debug
  }

  get pageOptionMap() {
    return this._pageOptionMap
  }
}
