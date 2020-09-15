import React from 'react';
import classnames from 'classnames';
import { formInputText, input } from './inputText.module.css';
import { fontMain } from '../../styles/fonts.module.css';

type Props = Readonly<{
  description: string;
  className?: string;
}>;

const InputRange = ({ description, className }: Props): JSX.Element => {
  return (
    <div className={`${formInputText} ${className}`}>
      <input className={classnames(input, fontMain)} type="text" placeholder={description} />
    </div>
  );
};

export default InputRange;
