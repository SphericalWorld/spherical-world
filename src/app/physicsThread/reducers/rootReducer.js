// @flow
import { combineReducers } from 'redux';

import { reduceReducers } from '../../../common/utils/reducerUtils';

import playerReducer from '../Player/playerReducer';
import chunkReducer from '../Terrain/Chunk/chunkReducer';

const combinedReducer = combineReducers({
  players: playerReducer,
  chunks: chunkReducer,
});

const rootReducer = reduceReducers(combinedReducer);

export default rootReducer;
