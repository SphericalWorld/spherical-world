import React from 'react';
import type { ReactNode } from 'react';
import classnames from 'classnames';
import Button from '../Button';
import Label from '../Label';
import { inner, inventoryName, header, wrapper, buttonClose } from './modalWindow.module.css';
import { alignment } from '../../styles/alignment.module.css';

type Props = Readonly<{
  caption: string;
  children?: ReactNode;
  onClose?: () => unknown;
}>;

const ModalWindow = ({ caption, children, onClose }: Props): JSX.Element => (
  <div className={classnames(wrapper, alignment)}>
    <div className={inner}>
      <header className={header}>
        <Label className={inventoryName}>{caption}</Label>
        <Button onClick={onClose} size="small" className={buttonClose}>
          <span role="img" aria-label="close-icon">
            ✖
          </span>
        </Button>
      </header>
      <section>{children}</section>
    </div>
  </div>
);

export default ModalWindow;
