import { useEffect } from 'react'
import { useAppContext } from './Store/context'
import { NavigationComponent } from './Navigation/NavigationComponent'
import { HomeComponent } from './Navigation/Home/HomeComponent'
import { LoginRegisterComponent } from './Authentication/LoginRegisterComponent'
import { AuthorsComponent } from './Authors/AuthorsComponent'
import { BooksComponent } from './Books/BooksComponent'

export default function AppComponent() {
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    dispatch({type: 'INIT'})
  }, [])

  const renderedComponents = [
    {
      id: 'homeLink',
      component: <HomeComponent key="homePage" />
    },
    {
      id: 'booksLink',
      component: <BooksComponent key="booksLink" />
    },
    {
      id: 'authorsLink',
      component: <AuthorsComponent key="authorsLink" />
    },
  ]

  return (
    <div className="container">
      {state.router.currentRoute.routeId === 'loginLink' ? (
        <LoginRegisterComponent />
      ) : (
        <div className="w3-row">
          <div className="w3-col s4 w3-center">
            <NavigationComponent />
          </div>
          <div className="w3-col s8 w3-left">
            {renderedComponents.map((current) => {
              return state.router.currentRoute.routeId === current.id && current.component
            })}
          </div>
        </div>
      )}
    </div>
  )
}
