import { createState, UIStates } from '../hud/utils/StateRouter/StateRouter';
import configureStore from './configureStore';

const store = configureStore();

export type Store = typeof store;

export default store;

export const uiRouterState = createState<UIStates>({});
