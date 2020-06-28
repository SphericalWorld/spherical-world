type Reducer<T> = (T, any) => T;

type ReducersMap<T> = {
  [key: string]: Reducer<T>;
};

type Action = Readonly<{ type: string; payload: unknown }>;

export const createReducer = <T>(
  initialState: T,
  fnMap: ReducersMap<T>,
): ((state: T | void, action: Action) => T) => {
  return (state = initialState, { type, payload }) => {
    const handler = fnMap[type];

    return handler ? handler(state, payload) : state;
  };
};

export const reduceReducers = <T>(...reducers: Reducer<T>[]): Reducer<T> => {
  return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
};

export const createConditionalSliceReducer = (sliceName: string, fnMap) => {
  const sliceReducer = createReducer({}, fnMap);
  return (state, action) => {
    if (fnMap[action.type]) {
      return {
        ...state,
        [sliceName]: sliceReducer(state[sliceName], action),
      };
    }
    return state;
  };
};
