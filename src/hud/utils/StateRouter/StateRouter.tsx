import { ComponentType, createContext, useContext, useEffect, useRef, useState } from 'react';
import { InputEvent } from '../../../../common/constants/input/eventTypes';
import { InputAction } from '../../../Input/InputAction';

type Props = Readonly<{
  on: string;
  component: ComponentType;
}>;

type Props2 = Readonly<{
  on: InputEvent;
  component: ComponentType;
}>;

type State<TState> = {
  setState: (updateFn: (oldState: TState) => TState) => void;
  subscribe: (selectorFn: (state: TState) => unknown) => () => void;
};

export type UIStates = Readonly<{
  [uiComponentName: string]: boolean;
}>;

export const createState = <TState extends unknown>(initialState: TState): State<TState> => {
  const subscriptions = new Set<(state: TState) => unknown>();
  let state: TState = initialState;
  return {
    setState(stateFn) {
      state = stateFn(state);
      for (const fn of subscriptions.keys()) {
        fn(state);
      }
    },
    subscribe(fn) {
      subscriptions.add(fn);
      return () => {
        subscriptions.delete(fn);
      };
    },
  };
};
const RouterContext = createContext<State<UIStates>>();

const useStateChange = (fn) => {
  const context = useContext(RouterContext);
  const [val, setVal] = useState();
  const oldVal = useRef();
  useEffect(() => {
    const unsubscribe = context.subscribe((newState) => {
      const vvval = fn(newState);
      if (vvval !== oldVal.current) {
        setVal(vvval);
        oldVal.current = vvval;
      }
    });
    return unsubscribe;
  }, [fn, context]);
  return val;
};

export const Router = ({ children, state }): JSX.Element => {
  return <RouterContext.Provider value={state}>{children}</RouterContext.Provider>;
};

export const Route = ({ on, component: Component }: Props): JSX.Element | null => {
  const isVisible = useStateChange((state: UIStates) => state[on]);
  if (!isVisible) return null;
  return <Component />;
};

export const useRouterContext = (): State<UIStates> => {
  return useContext(RouterContext);
};
