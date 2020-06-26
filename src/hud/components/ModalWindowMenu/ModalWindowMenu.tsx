import type { ReactNode } from 'react';
import React from 'react';
import {
  inner,
  wrapper,
  label,
  frame,
  cornerLeftTop,
  cornerLeftBottom,
  cornerRightTop,
  cornerRightBottom,
} from './modalWindowMenu.module.scss';

type Props = {
  caption: string;
  children?: ReactNode,
}

const ModalWindowMenu = ({ caption, children }: Props) => (
  <div className={wrapper}>
    <div className={inner}>
      <header className={label}>
        {caption}
      </header>
      <div className={frame}>
        <div className={cornerLeftTop} />
        <div className={cornerLeftBottom} />
        <div className={cornerRightTop} />
        <div className={cornerRightBottom} />
      </div>
      <section>
        {children}
      </section>
    </div>
  </div>
);

export default ModalWindowMenu;
