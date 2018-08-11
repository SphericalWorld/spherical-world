// @flow
export interface Chain<+R> {
  +chain: <U>(fn: R => Chain<U>) => Chain<U>;
}

const chain = <U>(fn: * => Chain<U>) => <T>(chainable: Chain<T>): Chain<U> => chainable.chain(fn);

export default chain;
