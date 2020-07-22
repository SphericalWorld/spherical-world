export const createArray = <T>(length: number, filler: (() => T) | T): Array<T> => {
  const arr =
    typeof filler === 'function'
      ? new Array(length).fill(0).map(() => filler())
      : new Array(length).fill(0).map(() => filler);

  return arr;
};

export const swap = <T>(arr: ReadonlyArray<T>, from: number, to: number): ReadonlyArray<T> => {
  const copy = arr.slice();
  const tmp = copy[from];
  copy[from] = copy[to];
  copy[to] = tmp;
  return copy;
};
