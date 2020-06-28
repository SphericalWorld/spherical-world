import { createReducer } from '../../../util/reducerUtils';
import { STATE_ROUTER_TOGGLE, STATE_ROUTER_SET } from './stateRouterConstants';

export type UIStates = Readonly<{
  [uiComponentName: string]: boolean;
}>;

const initialState: UIStates = {};

type OnToggleData = Readonly<{
  stateName: string;
}>;

const onToggle = (state: UIStates, { stateName }: OnToggleData): UIStates => ({
  ...state,
  [stateName]: !state[stateName],
});

const onSet = (
  state: UIStates,
  { stateName, value }: OnToggleData & { value: boolean },
): UIStates => ({
  ...state,
  [stateName]: value,
});

export default createReducer<UIStates>(initialState, {
  [STATE_ROUTER_TOGGLE]: onToggle,
  [STATE_ROUTER_SET]: onSet,
});
