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

type Props = {|
  +image: string;
|}

const TooltipImage = ({
  image,
}: Props) => (
  <TooltipText className={`${imageTooltip} ${gridArea}`}>
    <div className={`${images[image]} ${imgItem}`} />
  </TooltipText>
);

export default TooltipImage;
