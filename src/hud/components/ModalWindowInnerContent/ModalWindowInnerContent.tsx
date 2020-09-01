import type { ReactNode } from 'react';
import React from 'react';
import { content } from './modalWindowInnerContent.module.css';

type Props = Readonly<{
  children: ReactNode;
}>;

const ModalWindowInnerContent = ({ children }: Props): JSX.Element => (
  <div className={content}>{children}</div>
);

export default ModalWindowInnerContent;
