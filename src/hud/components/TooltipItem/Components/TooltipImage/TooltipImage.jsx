// @flow strict
import React from 'react';
import TooltipText from '../../Elements/TooltipText';
import {
  imageTooltip,
  gridArea,
  imgItem,
  imageDiamond,
  imageIronIngot,
} from './tooltipImage.module.scss';

const images = {
  diamond: imageDiamond,
  ironIngot: imageIronIngot,
};

type Props = {
  +icon: string;
}

const TooltipImage = ({
  icon,
}: Props) => (
  <TooltipText className={`${imageTooltip} ${gridArea}`}>
    <div className={`${images[icon]} ${imgItem}`} />
  </TooltipText>
);

export default TooltipImage;
