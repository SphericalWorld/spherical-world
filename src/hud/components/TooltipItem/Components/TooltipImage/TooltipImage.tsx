import React from 'react';
import TooltipText from '../../Elements/TooltipText';
import { getIcon } from '../../../../utils/CSSHelpers';
import {
  imageTooltip,
  gridArea,
  imgItem,
} from './tooltipImage.module.scss';

type Props = Readonly<{
  icon: string;
}>

const TooltipImage = ({
  icon,
}: Props) => (
  <TooltipText className={`${imageTooltip} ${gridArea}`}>
    <div className={`${getIcon(icon)} ${imgItem}`} />
  </TooltipText>
);

export default TooltipImage;
