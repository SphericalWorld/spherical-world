// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import workerMiddleware from './workerMiddleware';
import rootReducer from '../reducers/rootReducer';

export default function configureStore(preloadedState) {
  const middlewares = [thunk, workerMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(middlewareEnhancer),
  );
  return store;
}
