export interface Foldable<A> {
  reduce<B>(
    callbackfn: (
      previousValue: B,
      currentValue: A,
      currentIndex: number,
      array: Foldable<A>,
    ) => B,
    initialValue: B,
  ): B;
}
