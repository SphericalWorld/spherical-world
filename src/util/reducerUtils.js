// @flow
type ReducersMap<T> = {
  [string]: (T, any) => T,
};

export function createReducer<T>(initialState: T, fnMap: ReducersMap<T>): (T) => T {
  return (state = initialState, { type, payload }) => {
    const handler = fnMap[type];

    return handler ? handler(state, payload) : state;
  };
}

export function reduceReducers(...reducers: Function[]) {
  return (previous, current) =>
    reducers.reduce(
      (p, r) => r(p, current),
      previous,
    );
}

export function createConditionalSliceReducer(sliceName: string, fnMap) {
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
}
