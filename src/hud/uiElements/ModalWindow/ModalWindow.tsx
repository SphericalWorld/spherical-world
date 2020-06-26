import React from 'react';
import type { ReactNode } from 'react';
import Button from '../Button';
import Label from '../Label';
import {
  inner,
  inventoryName,
  header,
  wrapper,
  buttonClose,
} from './modalWindow.module.scss';

type Props = Readonly<{
  caption: string;
  children?: ReactNode;
  onClose?: () => unknown;
}>;

const ModalWindow = ({ caption, children, onClose }: Props) => (
  <div className={wrapper}>
    <div className={inner}>
      <header className={header}>
        <Label className={inventoryName}>{caption}</Label>
        <Button onClick={onClose} size="small" className={buttonClose}>
          ❌
        </Button>
      </header>
      <section>{children}</section>
    </div>
  </div>
);

export default ModalWindow;
