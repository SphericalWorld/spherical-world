// @flow
import type { Node } from 'react';
import React from 'react';
import {
  inner,
  wrapper,
  label,
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
      <section>
        {children}
      </section>
    </div>
  </div>
);

export default ModalWindow;
