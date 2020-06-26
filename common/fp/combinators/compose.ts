// B combinator
type Composer<A, B> = <C>(g: (C) => A) => $Call<$Compose, (A) => B, (C) => A>;

const compose = <A, B>(f: (A) => B): Composer<A, B> => g => x => f(g(x));

export default compose;
