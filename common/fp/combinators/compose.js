// @flow
// B combinator
type Composer<F> = <G: Function>(g: G) => $Call<$Compose, F, G>;

const compose = <F: Function>(f: F): Composer<F> => g => x => f(g(x));

export default compose;
