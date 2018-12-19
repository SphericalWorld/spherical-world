// @flow strict
type Reducer<T> = (T, any) => T;

type ReducersMap<T> = {
  [string]: Reducer<T>,
};

type Action = {| +type: string, +payload: any |};

export function createReducer<T>(initialState: T, fnMap: ReducersMap<T>): (T, Action) => T {
  return (state = initialState, { type, payload }) => {
    const handler = fnMap[type];

    return handler ? handler(state, payload) : state;
  };
}

export function reduceReducers<T>(...reducers: Reducer<T>[]): Reducer<T> {
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
