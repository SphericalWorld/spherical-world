// @flow
import type { Node } from 'react';
import React from 'react';
import {
  inner,
  wrapper,
  label,
  frame,
  angleLeftTop,
  angleLeftBottom,
  angleRightTop,
  angleRightBottom,
} from './modalWindow.scss';

type Props = {|
  +caption: string;
  +children?: Node,
|}

const ModalWindow = ({ caption, children }: Props) => (
  <div className={wrapper}>

    <div className={inner}>
      <header className={label}>
        {caption}
      </header>
      <div className={frame}>
        <div className={angleLeftTop} />
        <div className={angleLeftBottom} />
        <div className={angleRightTop} />
        <div className={angleRightBottom} />
      </div>
      <section>
        {children}
      </section>
    </div>
  </div>
);

export default ModalWindow;
