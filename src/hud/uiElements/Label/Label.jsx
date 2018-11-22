// @flow
import React from 'react';
import {
  label,
  small,
  big,
} from './label.module.scss';

export const SIZE_SMALL: 'small' = 'small';
export const SIZE_BIG: 'big' = 'big';

export type Size =
  | typeof SIZE_SMALL
  | typeof SIZE_BIG;

type Props = {|
  +text: string;
  +size?: Size;
  +className?: string;
|}

const sizes = {
  [SIZE_SMALL]: small,
  [SIZE_BIG]: big,
};

const Label = ({ text, size = SIZE_SMALL, className = '' }: Props) => (
  <span type="label" className={`${label} ${sizes[size]} ${className}`}>
    {text}
  </span>
);

export default Label;
