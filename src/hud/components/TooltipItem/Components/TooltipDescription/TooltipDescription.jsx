// @flow strict
import React from 'react';
import TooltipText from '../../Elements/TooltipText';
import {
  descriptionTooltip,
  gridArea,
} from './tooltipDescription.module.scss';


type Props = {
  +description: string;
}

const TooltipDescription = ({
  description,
}: Props) => (
  typeof description !== 'undefined'
  && (
    <TooltipText className={`${descriptionTooltip} ${gridArea}`}>
      <span>
        {description}
      </span>
    </TooltipText>
  )
);

export default TooltipDescription;
