// @flow
import React from 'react';
import type { Node } from 'react';
import Button from '../../uiElements/Button';
import Label from '../../uiElements/Label';
import {
  inner,
  inventoryName,
  header,
  wrapper,
  buttonClose,
  childrenSection,
} from './modalWindow.scss';

type Props = {|
  +caption: string;
  +children?: Node,
  +onClose?: () => *;
|}

const ModalWindow = ({ caption, children, onClose }: Props) => (
  <div className={wrapper}>
    <div className={inner}>
      <header className={header}>
        <Label text={caption} className={inventoryName} />
        <Button onClick={onClose} text="X" size="small" className={buttonClose} />
      </header>
      <section className={childrenSection}>
        {children}
      </section>
    </div>
  </div>
);

export default ModalWindow;
