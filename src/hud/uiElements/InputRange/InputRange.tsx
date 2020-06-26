import React, { useState } from 'react';
import Label from '../Label';
import {
  inputRange,
  valueLabel,
  valueDescript,
  formInputRange,
} from './inputRange.module.scss';

type Props = Readonly<{
  value?: number;
  className?: string;
}>;

const InputRange = ({ value = 15, className = '' }: Props) => {
  const [activeNumber, setActiveNumber] = useState(value);
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
        <Label className={valueLabel}>{activeNumber}</Label>
      </div>
    </div>
  );
};

export default InputRange;
