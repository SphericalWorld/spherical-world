import { STATE_ROUTER_TOGGLE, STATE_ROUTER_SET } from './stateRouterConstants';

export const toggleUIState = (stateName: string) => ({
  type: STATE_ROUTER_TOGGLE,
  payload: { stateName },
});

export const setUIState = (stateName: string, value: boolean) => ({
  type: STATE_ROUTER_SET,
  payload: { stateName, value },
});
