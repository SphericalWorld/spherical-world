// @flow

export const createArray = <T>(length: number, filler: (() => T) | T): Array<T> => {
  const arr = new Array(length);
  if (typeof filler === 'function') {
    for (let i = 0; i < length; i += 1) {
      arr[i] = filler();
    }
  } else {
    for (let i = 0; i < length; i += 1) {
      arr[i] = filler;
    }
  }

  return arr;
};
