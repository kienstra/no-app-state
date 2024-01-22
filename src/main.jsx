import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { AppContext } from './Store/context'
import { reducer } from './Store/reducer'
import AppComponent from './AppComponent'
import initialState from './Store/initialState'

function useAsync(red, initial) {
  const [state, updateState] = useState(initial)

  return {
    state,
    dispatch: async (action) => {
      updateState(await red(state, action))
    }
  }
}

function App() {
  return (
    <AppContext.Provider value={useAsync(reducer, initialState)}>
      <AppComponent />
    </AppContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
