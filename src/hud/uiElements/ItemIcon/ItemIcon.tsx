import React from 'react';
import classnames from 'classnames';
import { imageIcon, emptyImg, img, smallImg, mediumImg, bigImg } from './itemIcon.module.css';

type Props = Readonly<{
  src?: string;
  className?: string;
  size?: 'small' | 'medium' | 'big';
}>;

const sizeCSS = {
  small: smallImg,
  medium: mediumImg,
  big: bigImg,
};

const img1px = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const ItemIcon = ({ src, className, size = 'medium' }: Props): JSX.Element => {
  return (
    <div className={`${imageIcon} ${className}`}>
      {src ? (
        <img className={classnames(img, sizeCSS[size])} src={src} alt="ItemIcon" />
      ) : (
        <img className={classnames(sizeCSS[size], emptyImg)} src={img1px} alt="ItemIcon" />
      )}
    </div>
  );
};

export default ItemIcon;
