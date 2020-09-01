import type { ReactNode } from 'react';
import React from 'react';
import classnames from 'classnames';
import {
  inner,
  wrapper,
  label,
  frame,
  cornerLeftTop,
  cornerLeftBottom,
  cornerRightTop,
  cornerRightBottom,
  corner,
} from './modalWindowMenu.module.scss';
import { alignment } from '../../styles/sizes.module.scss';
import { fontMain } from '../../styles/fonts.module.scss';

type Props = Readonly<{
  caption: string;
  children?: ReactNode;
}>;

const ModalWindowMenu = ({ caption, children }: Props): JSX.Element => (
  <div className={classnames(wrapper, alignment)}>
    <div className={inner}>
      <header className={classnames(label, fontMain)}>{caption}</header>
      <div className={frame}>
        <div className={classnames(cornerLeftTop, corner)} />
        <div className={classnames(cornerLeftBottom, corner)} />
        <div className={classnames(cornerRightTop, corner)} />
        <div className={classnames(cornerRightBottom, corner)} />
      </div>
      <section>{children}</section>
    </div>
  </div>
);

export default ModalWindowMenu;
