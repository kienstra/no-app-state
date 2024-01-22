import { useAppContext } from '../Store/context'

export function LogoutComponent() {
  const { dispatch } = useAppContext()
  return (
    <div
      onClick={() => dispatch({type: 'LOG_OUT'})}
      className="navigation-item"
      style={{ backgroundColor: '#5BCA06' }}
    >
      <span>☯ Logout</span>
    </div>
  )
}
