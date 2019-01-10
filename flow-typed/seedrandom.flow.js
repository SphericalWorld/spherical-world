// @flow strict
declare module 'seedrandom' {
  declare type seedrandom$seedrandomStateType = boolean | (() => PRNG);

  declare type PRNG = {
    new(
      seed?: string,
      options?: Options,
      callback?: Callback
    ): PRNG;
    (): number;
    quick(): number;
    int32(): number;
    double(): number;
    state(): () => PRNG;
  }

  declare type Seedrandom = {
    (
      seed?: string,
      options?: Options,
      callback?: Callback
    ): PRNG;
    alea: (
      seed?: string,
      options?: Options,
      callback?: Callback
    ) => PRNG;
    xor128: (
      seed?: string,
      options?: Options,
      callback?: Callback
    ) => PRNG;
    tychei: (
      seed?: string,
      options?: Options,
      callback?: Callback
    ) => PRNG;
    xorwow: (
      seed?: string,
      options?: Options,
      callback?: Callback
    ) => PRNG;
    xor4096: (
      seed?: string,
      options?: Options,
      callback?: Callback
    ) => PRNG;
    xorshift7: (
      seed?: string,
      options?: Options,
      callback?: Callback
    ) => PRNG;
    quick: (
      seed?: string,
      options?: Options,
      callback?: Callback
    ) => PRNG;
  }

  declare type Callback = (
    prng?: PRNG,
    shortseed?: string,
    global?: boolean,
    state?: seedrandom$seedrandomStateType
  ) => PRNG;

  declare type Options = {
    entropy?: boolean;
    global?: boolean;
    state?: seedrandom$seedrandomStateType;
    pass?: Callback;
  }
  declare var seedrandom: Seedrandom;
  declare module.exports: typeof seedrandom;
}
