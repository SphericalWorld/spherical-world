// @flow
const range = (from: number, to: number, fn: (i: number) => any): void => {
  for (let i = from; i < to; i += 1) {
    fn(i);
  }
};

export default range;
