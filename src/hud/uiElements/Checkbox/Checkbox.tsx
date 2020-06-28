import React, { ReactNode } from 'react';
import Label from '../Label';
import { checkbox, small, big, checkboxLabel, checkboxName } from './checkbox.module.scss';

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

const Checkbox = ({ size = SIZE_BIG, className = '', children }: Props) => (
  <div className={checkboxLabel}>
    <input
      type="checkbox"
      id="scales"
      name="scales"
      className={`${checkbox} ${sizes[size]} ${className}`}
    />
    <Label className={checkboxName} size={size}>
      {children}
    </Label>
  </div>
);

export default Checkbox;
