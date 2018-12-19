// @flow strict
import React from 'react';
import type { Node } from 'react';
import Button from '../Button';
import Label from '../Label';
import {
  inner,
  inventoryName,
  header,
  wrapper,
  buttonClose,
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
      <section>
        {children}
      </section>
    </div>
  </div>
);

export default ModalWindow;
