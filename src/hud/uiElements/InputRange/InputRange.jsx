// @flow strict
import React, { useState } from 'react';
import Label from '../Label';
import {
  inputRange,
  value,
  valueDescript,
  formInputRange,
} from './inputRange.module.scss';

type Props = {|
  +valueNum?: number;
  +className?: string;
|}

const InputRange = ({ valueNum = 15, className = '' }: Props) => {
  const [activeNumber, setActiveNumber] = useState(valueNum);
  const handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>) =>
    setActiveNumber(parseInt(e.currentTarget.value, 10));

  const min = 0;
  const max = 100;
  const step = 5;
  return (
    <div className={`${formInputRange} ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        onChange={handleInputChange}
        value={activeNumber}
        className={inputRange}
      />
      <div className={valueDescript}>
        <Label className={value}>{activeNumber}</Label>
      </div>
    </div>
  );
};

export default InputRange;
