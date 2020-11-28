import type { ReactNode } from 'react';
import classnames from 'classnames';
import { label, small, big } from './label.module.css';
import { fontMain } from '../../styles/fonts.module.css';

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
  <span className={`${classnames(label, fontMain)} ${sizes[size]} ${className}`}>{children}</span>
);

export default Label;
