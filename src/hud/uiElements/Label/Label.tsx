import React, { ReactNode } from 'react';
import { label, small, big } from './label.module.scss';

export const SIZE_SMALL: 'small' = 'small';
export const SIZE_BIG: 'big' = 'big';

export type Size = typeof SIZE_SMALL | typeof SIZE_BIG;

type Props = Readonly<{
  children?: ReactNode;
  size?: Size;
  className?: string;
}>;

const sizes = {
  [SIZE_SMALL]: small,
  [SIZE_BIG]: big,
};

const Label = ({ size = SIZE_SMALL, className = '', children }: Props): JSX.Element => (
  <span className={`${label} ${sizes[size]} ${className}`}>{children}</span>
);

export default Label;
