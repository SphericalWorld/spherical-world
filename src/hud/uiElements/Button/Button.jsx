// @flow
import React from 'react';
import { button, small, big } from './button.scss';

export const SIZE_SMALL: 'small' = 'small';
export const SIZE_BIG: 'big' = 'big';

export type Size =
  | typeof SIZE_SMALL
  | typeof SIZE_BIG;

type Props = {|
  +text: string;
  +size?: Size;
  +onClick?: () => *
|}

const sizes = {
  [SIZE_SMALL]: small,
  [SIZE_BIG]: big,
};

const Button = ({ text, size = SIZE_BIG, onClick }: Props) => (
  <button onClick={onClick} type="button" className={`${button} ${sizes[size]}`}>
    {text}
  </button>
);

export default Button;
