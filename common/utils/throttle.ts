const throttle = <A extends unknown[]>(
  fn: (...params: A) => void,
  delay: number,
): ((...params: A) => void) => {
  let lastInvoke = 0;
  return (...params: A) => {
    const now = Date.now();
    if (now > lastInvoke + delay) {
      lastInvoke = Date.now();
      fn(...params);
    }
  };
};

export default throttle;
