// @flow strict
import { combineReducers } from 'redux';
import { reduceReducers } from '../util/reducerUtils';

import { routerReducer } from '../hud/utils/StateRouter';
import hudReducer from '../hud/hudReducer';
import keyBindingsReducer from '../hud/components/KeyBindings/keyBindingsReducer';
import mainPanelReducer from '../hud/components/MainPanel/mainPanelReducer';

const reducers = {
  hudData: hudReducer,
  keyBindings: keyBindingsReducer,
  uiStates: routerReducer,
  mainPanel: mainPanelReducer,
};

type $ExtractFunctionReturn = <V>(v: (...args: mixed) => V) => V;

const combinedReducer = combineReducers(reducers);

const rootReducer = reduceReducers(combinedReducer);

export type State = $ObjMap<typeof reducers, $ExtractFunctionReturn>;

export default rootReducer;
