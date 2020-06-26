import configureStore from './configureStore';

const store = configureStore();

export type Store = typeof store;

export default store;
