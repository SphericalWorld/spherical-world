import React from 'react';
import { formInputText, input } from './inputText.module.css';

type Props = Readonly<{
  description: string;
  className?: string;
}>;

const InputRange = ({ description, className }: Props): JSX.Element => {
  return (
    <div className={`${formInputText} ${className}`}>
      <input className={input} type="text" placeholder={description} />
    </div>
  );
};

export default InputRange;
