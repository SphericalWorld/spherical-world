import type { ReactNode } from 'react';
import React from 'react';
import { defaultColor, text } from './tooltipText.module.scss';

type Props = Readonly<{
  children?: ReactNode;
  color?: string;
  className?: string;
}>;

const TooltipText = ({ color = defaultColor, className = '', children }: Props): JSX.Element => (
  <div className={`${color} ${className} ${text}`}>{children}</div>
);

export default TooltipText;
