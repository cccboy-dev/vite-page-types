import { msg } from '~page-types'

const HistoryDetail = () => {
  return (
    <div>
      welcome, History: {msg}
      <button className="ml-12px" onClick={() => history.back()}>back</button>
    </div>
  )
}

export default HistoryDetail
