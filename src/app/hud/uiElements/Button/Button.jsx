// @flow
import React from 'react';
import { button } from './button.scss';

export const SIZE_SMALL: 'small' = 'small';
export const SIZE_BIG: 'big' = 'big';

export type Size =
  | typeof SIZE_SMALL
  | typeof SIZE_BIG;

type Props = {|
  +text: string;
  +size?: Size;
|}

const Button = ({ text, size = SIZE_SMALL }: Props) => (
  <button type="button" className={`${button} ${size}`}>
    {text}
  </button>
);

export default Button;
