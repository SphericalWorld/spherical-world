// @flow
import { createReducer } from '../../../util/reducerUtils';
import { STATE_ROUTER_TOGGLE, STATE_ROUTER_SET } from './stateRouterConstants';

export type UIStates = {
  +[string]: boolean
};

const initialState: UIStates = {};

type OnToggleData = {|
  +stateName: string,
|};

const onToggle = (state, { stateName }: OnToggleData): UIStates => ({
  ...state,
  [stateName]: !state[stateName],
});

const onSet = (state, { stateName, value }: OnToggleData & { value: boolean }): UIStates => ({
  ...state,
  [stateName]: value,
});

export default createReducer<typeof initialState>(initialState, {
  [STATE_ROUTER_TOGGLE]: onToggle,
  [STATE_ROUTER_SET]: onSet,
});
