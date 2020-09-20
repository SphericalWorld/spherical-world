import React from 'react';
import TooltipText from '../../Elements/TooltipText';
// import { getIcon } from '../../../../utils/CSSHelpers';
import { imageTooltip, gridArea, imgItem } from './tooltipImage.module.css';

type Props = Readonly<{
  icon: string;
}>;

const TooltipImage = ({ icon }: Props): JSX.Element => (
  <TooltipText className={`${imageTooltip} ${gridArea}`}>
    <img src={icon} alt="TolltipItemIcon" className={imgItem} />
  </TooltipText>
);

export default TooltipImage;
