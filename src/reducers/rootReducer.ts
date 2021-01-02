import { combineReducers } from 'redux';
import { reduceReducers } from '../util/reducerUtils';

import hudReducer from '../hud/hudReducer';
import mainPanelReducer from '../hud/components/MainPanel/mainPanelReducer';
import inventoryReducer from '../hud/components/Inventory/inventoryReducer';

const hudData = reduceReducers(hudReducer, (state, action) => ({
  ...state,
  player: {
    ...state.player,
    inventory: inventoryReducer(state.player.inventory, action),
  },
}));

const reducers = {
  hudData,
  mainPanel: mainPanelReducer,
};

const combinedReducer = combineReducers(reducers);

export type State = {
  hudData: ReturnType<typeof hudReducer>;
  mainPanel: ReturnType<typeof mainPanelReducer>;
};

const rootReducer = reduceReducers<State>(combinedReducer);

export default rootReducer;
