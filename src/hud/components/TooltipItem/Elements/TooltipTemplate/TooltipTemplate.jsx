// @flow strict
import React from 'react';
import TooltipText from '../TooltipText';
import {
  templateTooltip,
  labelTooltip,
  valueTooltip,
} from './tooltipTemplate.module.scss';


type Props = {|
  +value: number;
  +name: string;
  +className?: string;
|}

const TooltipTemplate = ({
  value, name, className = '',
}: Props) => (
  <TooltipText className={`${templateTooltip} ${className}`}>
    <div>
      <span className={labelTooltip}>
        {name}
        :
      </span>
      <span className={valueTooltip}>
        {value}
      </span>
    </div>
  </TooltipText>
);

export default TooltipTemplate;
