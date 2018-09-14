// @flow
import { combineReducers } from 'redux';
import { reduceReducers } from '../common/utils/reducerUtils';

import hudReducer from '../hud/hudReducer';

const combinedReducer = combineReducers({
  hudData: hudReducer,
});

const rootReducer = reduceReducers(combinedReducer);

export default rootReducer;
