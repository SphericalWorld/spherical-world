import type { Store } from 'redux';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import type { State } from '../reducers/rootReducer';
import rootReducer from '../reducers/rootReducer';

export default function configureStore(preloadedState?: State): Store<State, any> {
  const composedEnhancer = composeWithDevTools();

  const store = createStore(rootReducer, preloadedState, composedEnhancer);

  if (process.env.NODE_ENV !== 'production') {
    if ('hot' in module) {
      module.hot?.accept('../reducers/rootReducer', () => {
        const newRootReducer = require('../reducers/rootReducer').default;
        store.replaceReducer(newRootReducer);
      });
    }
  }

  return store;
}
