import { imageDiamond, imageIronIngot } from './icon.module.scss';

const images = {
  diamond: imageDiamond,
  ironIngot: imageIronIngot,
};

const getIcon = (icon: 'diamond' | 'ironIngot'): string => images[icon];

export default getIcon;
