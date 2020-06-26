import type { Store } from 'redux';
import shallowEqual from './shallowEqual';

const connect = <A extends {}, B extends {}, S>(
  mapState: (A) => B,
  store: Store<A, S>,
) => (handler: (B, B) => unknown) => {
  let prevProps = mapState(store.getState());
  store.subscribe(() => {
    const nextProps = mapState(store.getState());
    if (shallowEqual(prevProps, nextProps)) {
      return;
    }
    const arg = prevProps; // needed in case if update will throw and fall down to infinite loop
    prevProps = nextProps;
    handler(arg, nextProps);
  });
  handler(prevProps, prevProps);
  return handler;
};

export default connect;
