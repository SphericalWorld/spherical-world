
export type SetDifference<A, B> = A extends B ? never : A;

export type Diff<T extends object, U extends object> = Pick<
  T,
  SetDifference<keyof T, keyof U>
>;

export type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

declare global {
  type SpreadTypes<
    T extends object,
    U extends object,
    I = Diff<T, U> & Intersection<U, T> & Diff<U, T>
  > = Pick<I, keyof I>;

  type Class<T> = new (...args: any[]) => T;

  type $Call<Fn extends (...args: any[]) => any> = Fn extends (
    arg: any
  ) => infer RT
    ? RT
    : never;

  type ValueOf<T> = T[keyof T];
}
