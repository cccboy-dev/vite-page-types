import { msg } from '~page-types'

const Profile = () => {
  return (
    <div>
      welcome, {msg}
      <button className="ml-12px" onClick={() => history.back()}>back</button>
    </div>
  )
}

export default Profile
