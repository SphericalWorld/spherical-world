// @flow
import type { Node } from 'react';
import React from 'react';
import {
  mainMenu,
  wrapper,
  labelMenu,
} from './modalWindow.scss';

type Props = {|
  +text: string;
  +children?: Node,
|}

const ModalWindow = ({ text, children }: Props) => (
  <div className={wrapper}>
    <nav className={mainMenu}>
      <div className={labelMenu}>
        {text}
      </div>
      <div>
        {children}
      </div>
    </nav>

  </div>
);

export default ModalWindow;
