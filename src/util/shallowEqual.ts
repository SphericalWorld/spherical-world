const shallowEqual = (objA: {}, objB: {}): boolean => {
  if (objA === objB) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keysA.length; i += 1) {
    if (!hasOwn.call(objB, keysA[i])
      || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
};

export default shallowEqual;
