import { msg } from '~page-types'

const History = () => {
  return (
    <div>
      welcome, History: {msg}
      <button className="ml-12px" onClick={() => history.back()}>back</button>
    </div>
  )
}

export default History
