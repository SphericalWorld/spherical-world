import { combineReducers } from 'redux';
import { reduceReducers } from '../util/reducerUtils';

import { routerReducer } from '../hud/utils/StateRouter';
import hudReducer from '../hud/hudReducer';
import keyBindingsReducer from '../hud/components/KeyBindings/keyBindingsReducer';
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
  keyBindings: keyBindingsReducer,
  uiStates: routerReducer,
  mainPanel: mainPanelReducer,
};

const combinedReducer = combineReducers(reducers);

export type State = {
  hudData: ReturnType<typeof hudReducer>;
  keyBindings: ReturnType<typeof keyBindingsReducer>;
  uiStates: ReturnType<typeof routerReducer>;
  mainPanel: ReturnType<typeof mainPanelReducer>;
};

const rootReducer = reduceReducers<State>(combinedReducer);

// export type State = $ObjMap<typeof reducers, $ExtractFunctionReturn>;

export default rootReducer;
