// @flow
import { combineReducers } from 'redux';

import { reduceReducers } from '../../common/utils/reducerUtils';

import playerReducer from '../player/playerReducer';
import mouseReducer from '../mouse/mouseReducer';
import hudReducer from '../hud/hudReducer';
import chunkReducer from '../Terrain/Chunk/chunkReducer';

const combinedReducer = combineReducers({
  players: playerReducer,
  mouse: mouseReducer,
  hudData: hudReducer,
  chunks: chunkReducer,
});


const rootReducer = reduceReducers(combinedReducer,
  // entityCrudReducer,
  // editingFeatureReducer,
);

export default rootReducer;
