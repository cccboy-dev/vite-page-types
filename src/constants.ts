export const MODULE_IDS = ['~page-types', 'virtual:generated-page-types']

export const MODULE_ID_VIRTUAL = '/@vite-plugin-page-types/generated-page-types'
export const ROUTE_IMPORT_NAME = '__pages_import_$1__'

export const routeBlockQueryRE = /\?vue&type=route/

export const dynamicRouteRE = /^\[(.+)\]$/
export const cacheAllRouteRE = /^\[\.{3}(.*)\]$/
export const replaceDynamicRouteRE = /^\[(?:\.{3})?(.*)\]$/

export const nuxtDynamicRouteRE = /^_(.*)$/
export const nuxtCacheAllRouteRE = /^_$/

export const countSlashRE = /\//g

export const replaceIndexRE = /\/?index$/

export const CONFIG_FILE_NAME = 'page.config.ts'
