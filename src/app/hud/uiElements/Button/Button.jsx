// @flow
import React from 'react';
import { button } from './button.scss';

type Props = {
  text: string;
}

const Button = ({ text }: Props) => (
  <button className={button}>
    {text}
  </button>
);

export default Button;
