import { configureStore } from '@reduxjs/toolkit'
import rootReducer from "./reducers";
import { createBrowserHistory } from 'history'
import logger from 'redux-logger'
export const history = createBrowserHistory()

const enhancers = []
// const middleware = [thunk, routerMiddleware(history),logger]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}


const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  // enhancers: composedEnhancers
})

export default store;