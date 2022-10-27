import { definePage } from 'vite-plugin-page-types'
import type { Gender as a1 } from './types'

export interface PageParams {
  id: string
  childId: string
  gender: a1
}

export default definePage({
  title: '历史记录',
  description: '关于历史记录的一些信息',
})
