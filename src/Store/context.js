import { createContext, useContext } from 'react';
import initialState from './initialState';

export const AppContext = createContext();

/** @type {function(): {state: initialState, dispatch: Promise<React.DispatchWithoutAction>}} */
export const useAppContext = function() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('must call useAppContext() within a provider')
  }

  return context;
}
