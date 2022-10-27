import { definePage } from 'vite-plugin-page-types'

export interface PageParams {
  id: string
  childId: string
}

export default definePage({
  title: '历史记录',
  description: '关于历史记录的一些信息',
})
