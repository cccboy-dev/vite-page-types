import type { Awaitable } from '@antfu/utils'
import type { PageContext } from './context'

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type ImportMode = 'sync' | 'async'
export type ImportModeResolver = (filepath: string, pluginOptions: ResolvedOptions) => ImportMode

export interface ParsedJSX {
  value: string
  loc: {
    start: {
      line: number
    }
  }
}

export type CustomBlock = Record<string, any>

export type InternalPageResolvers = 'vue' | 'react' | 'solid'

export interface PageOptions {
  dir: string
  path: string
  config?: string
}

export interface PageResolver {
  resolveModuleIds: () => string[]
  resolveExtensions: () => string[]
  resolveRoutes: (ctx: PageContext) => Awaitable<string>
  // getComputedRoutes: (ctx: PageContext) => Awaitable<VueRoute[] | ReactRoute[] | SolidRoute[]>
  stringify?: {
    dynamicImport?: (importPath: string) => string
    component?: (importName: string) => string
    final?: (code: string) => string
  }
  hmr?: {
    added?: (ctx: PageContext, path: string) => Awaitable<void>
    removed?: (ctx: PageContext, path: string) => Awaitable<void>
    changed?: (ctx: PageContext, path: string) => Awaitable<void>
  }
}

/**
 * Plugin options.
 */
interface Options {

  /**
   * @default ["src/pages/**\/index.{vue,tsx}"]
   */
  include: string[]

  /**
   * List of path globs to exclude when resolving pages.
   */
  exclude: string[]

  /**
   * Module id for routes import
   * @default '~pages-types'
   */
  moduleId: string

  /**
   * Filename of the config file
   * @default '[name].pageconfig'
   */
  configFileName?: string
}

export type UserOptions = Partial<Options>

export interface ResolvedOptions extends Omit<Options, 'include' | 'moduleId'> {
  /**
   * Resolves to the `root` value from Vite config.
   * @default config.root
   */
  root: string
  /**
   * Resolved page path
   */
  path: PageOptions[]

  /**
   * Module IDs for routes import
   */
  moduleIds: string[]
}

export interface PageConfig {

  /**
   * 页面路由
   */
  path?: string

  /**
   * 页面名称
   */
  title?: string

  /**
   * 页面描述
   */
  description?: string

  /**
   * 页面类型 - 需要全局唯一，否则抛出异常
   */
  type?: string
}
