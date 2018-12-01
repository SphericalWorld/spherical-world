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
} from './modalWindow.module.scss';

type Props = {|
  +caption: string;
  +children?: Node,
  +onClose?: () => mixed;
|}

const ModalWindow = ({ caption, children, onClose }: Props) => (
  <div className={wrapper}>
    <div className={inner}>
      <header className={header}>
        <Label className={inventoryName}>{caption}</Label>
        <Button onClick={onClose} size="small" className={buttonClose}>×</Button>
      </header>
      <section className={childrenSection}>
        {children}
      </section>
    </div>
  </div>
);

export default ModalWindow;
