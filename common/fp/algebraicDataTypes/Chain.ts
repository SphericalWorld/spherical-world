export interface Chain<A> {
  chain: <B>(fn: (A) => Chain<B>) => Chain<B>;
}

const chain = <B>(fn: (any) => Chain<B>) => <A>(chainable: Chain<A>): Chain<B> => chainable.chain(fn);

export default chain;
