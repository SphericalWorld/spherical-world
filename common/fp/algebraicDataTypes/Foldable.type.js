// @flow
export interface Foldable<T> {
  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: Foldable<T>
    ) => U,
    initialValue: U
  ): U;
}
