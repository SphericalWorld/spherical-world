import { combineReducers } from 'redux';

import { reduceReducers } from '../../common/utils/reducerUtils';

import playerReducer from '../player/playerReducer';
import mouseReducer from '../mouse/mouseReducer';
import raytracerReducer from '../raytracer/raytracerReducer';
import chunkReducer from '../Terrain/Chunk/chunkReducer';

const combinedReducer = combineReducers({
  players: playerReducer,
  mouse: mouseReducer,
  raytracer: raytracerReducer,
  chunks: chunkReducer,
});


const rootReducer = reduceReducers(combinedReducer,
  // entityCrudReducer,
  // editingFeatureReducer,
);

export default rootReducer;
