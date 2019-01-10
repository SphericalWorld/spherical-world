// @flow strict
import { useState, useEffect } from 'react';

type Props<T> = {|
  +onChange: (T, T) => string,
  +defaultClassName?: string,
  +duration: number,
|};

const useCSSTransition = <T>(value: T, {
  onChange,
  defaultClassName,
  duration,
}: Props<T>) => {
  const [state, setState] = useState(value);
  const [className, setClassName] = useState(defaultClassName);
  const [timeoutId, setTimeoutId] = useState();

  useEffect(
    () => {
      clearTimeout(timeoutId);
      setTimeoutId(setTimeout(() => {
        setClassName(defaultClassName);
      }, duration));
    },
    [className],
  );

  if (state !== value) {
    setState(value);
    setClassName(onChange(state, value));
  }
  return { className };
};

export default useCSSTransition;
