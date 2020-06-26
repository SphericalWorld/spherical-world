import { useState, useEffect } from 'react';

type Props<T> = Readonly<{
  onChange: (T, T) => string,
  defaultClassName?: string,
  duration: number,
}>;

const useCSSTransition = <T extends any>(value: T, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [className],
  );

  if (state !== value) {
    setState(value);
    setClassName(onChange(state, value));
  }
  return { className };
};

export default useCSSTransition;
