// @flow strict
import shallowEqual from './shallowEqual';

type MapActions = () => {| [string]: Function |};

export default function connect(mapState: ?Function, mapActions: ?MapActions, store: Object) {
  return function decorator<T: Class<any>>(Target: T) {
    class Connected extends Target {
      constructor(...params) {
        super(...params);
        if (mapState) {
          let prevProps = mapState(store.getState(), this);
          this[Symbol('unsubscribe')] = store.subscribe(() => {
            const nextProps = mapState(store.getState(), this);
            if (shallowEqual(prevProps, nextProps)) {
              return;
            }
            Object.assign(this, nextProps);
            if (this.componentDidUpdate) {
              const arg = prevProps; // needed in case if update will throw and fall down to infinite loop
              prevProps = nextProps;
              this.componentDidUpdate(arg);
            }
          });
          Object.assign(this, prevProps);
          if (this.componentDidMount) {
            this.componentDidMount();
          }
        }
      }
    }
    if (mapActions) {
      for (const [key, action] of Object.entries(mapActions())) {
        Connected.prototype[key] = (...params) => store.dispatch(action(...params));
      }
    }
    return Connected;
  };
}
