// @flow strict
import React from 'react';
import TooltipText from '../../Elements/TooltipText';
import {
  descriptionTooltip,
  gridArea,
  descriptionText,
} from './tooltipDescription.module.scss';


type Props = {
  +description: string;
}

const TooltipDescription = ({
  description,
}: Props) => (
  <TooltipText className={`${descriptionTooltip} ${gridArea}`}>
    <span className={descriptionText}>
      {description}
    </span>
  </TooltipText>
);

export default TooltipDescription;
