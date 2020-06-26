const throttle = <A>(fn: (A) => void, delay: number): ((A) => void) => {
  let lastInvoke = 0;
  return (...params: A[]) => {
    const now = Date.now();
    if (now > lastInvoke + delay) {
      lastInvoke = Date.now();
      fn(...params);
    }
  };
};

export default throttle;
