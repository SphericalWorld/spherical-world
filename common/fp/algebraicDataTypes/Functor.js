// @flow
export interface Functor<A> {
  map<B>(fn: A => B): Functor<B>
}

const map = <B>(fn: * => B) => <A>(functor: Functor<A>): Functor<B> => functor.map(fn);

export default map;
