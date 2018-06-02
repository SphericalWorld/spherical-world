// @flow
import { combineReducers } from 'redux';

import { reduceReducers } from '../../../common/utils/reducerUtils';

import playerReducer from '../Player/playerReducer';
import chunkReducer from '../Terrain/Chunk/chunkReducer';
import mouseReducer from '../Raytracer/mouseReducer';

const combinedReducer = combineReducers({
  players: playerReducer,
  chunks: chunkReducer,
  mouse: mouseReducer,
});


const rootReducer = reduceReducers(combinedReducer);

export default rootReducer;
