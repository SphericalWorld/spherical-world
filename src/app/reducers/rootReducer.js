// @flow
import { combineReducers } from 'redux';

import { reduceReducers } from '../../common/utils/reducerUtils';

import playerReducer from '../player/playerReducer';
import hudReducer from '../hud/hudReducer';

const combinedReducer = combineReducers({
  players: playerReducer,
  hudData: hudReducer,
});

const rootReducer = reduceReducers(combinedReducer,
  // entityCrudReducer,
  // editingFeatureReducer,
);

export default rootReducer;
