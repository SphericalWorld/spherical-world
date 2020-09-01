import React, { ReactNode } from 'react';
import { button, small, big } from './button.module.css';

export const SIZE_SMALL: 'small' = 'small';
export const SIZE_BIG: 'big' = 'big';

export type Size = typeof SIZE_SMALL | typeof SIZE_BIG;

type Props = Readonly<{
  children?: ReactNode;
  size?: Size;
  onClick?: () => unknown;
  className?: string;
}>;

const sizes = {
  [SIZE_SMALL]: small,
  [SIZE_BIG]: big,
};

const Button = ({ size = SIZE_BIG, onClick, className = '', children }: Props): JSX.Element => (
  <button onClick={onClick} type="button" className={`${button} ${sizes[size]} ${className}`}>
    {children}
  </button>
);

export default Button;
