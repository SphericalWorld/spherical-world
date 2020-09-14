// Do not delete or global types wont work anymore :(
export type SetDifference<A, B> = A extends B ? never : A;

declare global {
  type SpreadTypes<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] } & B extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

  type Class<T> = new (...args: unknown[]) => T;

  type ValueOf<T> = T[keyof T];
}
