import { navVm } from '../Store/selector';
import { LogoutComponent } from '../Authentication/LogoutComponent'
import { useAppContext } from '../Store/context';

export function NavigationComponent() {
  const { dispatch, state } = useAppContext();

  return (
    <div className="navigation-container">
      <div
        className="navigation-item-header"
        style={{ backgroundColor: '#5BCA06' }
      }>
        {navVm(state).currentSelectedVisibleName}
      </div>
      {navVm(state).menuItems.map((menuItem, i) => {
        return (
          <div
            key={i}
            className="navigation-item"
            style={{
              backgroundColor: '#3DE7CF'
            }}
            onClick={() => {
              dispatch({
                type: 'UPDATE_ROUTE',
                payload: {newRouteId: menuItem.id},
              })
            }}
          >
            {menuItem.visibleName}
          </div>
        )
      })}
      {navVm(state).showBack && (
        <div
          className="navigation-item"
          onClick={() => {
            dispatch({type: 'NAVIGATE_BACK'})
          }}
          style={{ backgroundColor: '#2e91fc' }}
        >
          <span>⬅ </span>Back
        </div>
      )}
      <LogoutComponent />
    </div>
  )
}
