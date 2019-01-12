// @flow strict
import React from 'react';
import {
  defaultColor,
  text,
} from './tooltipText.module.scss';


type Props = {|
  +children?: React$Node;
  +color?: string;
  +className?: string;
|}

const TooltipText = ({
  color = defaultColor, className = '', children,
}: Props) => (

  <div
    className={`${color} ${className} ${text}`}
  >
    {children}
  </div>
);

export default TooltipText;
