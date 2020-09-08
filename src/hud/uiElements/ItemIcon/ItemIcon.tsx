import React from 'react';
import { imageIcon, emptyImg, img } from './itemIcon.module.css';

type Props = Readonly<{
  src?: string;
  className?: string;
}>;

const ItemIcon = ({ src, className }: Props): JSX.Element => {
  return (
    <div className={`${imageIcon} ${className}`}>
      {src ? (
        <img className={img} src={src} alt="ItemIcon" />
      ) : (
        <img
          className={emptyImg}
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="ItemIcon"
        />
      )}
    </div>
  );
};

export default ItemIcon;
