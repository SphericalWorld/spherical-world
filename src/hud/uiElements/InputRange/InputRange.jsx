// @flow strct
import React, { useState } from 'react';
import Label from '../Label';
import {
  inputRange,
  text,
  value,
  valueDescript,
  mark,
  markMin,
  markMax,
} from './inputRange.module.scss';

const InputRange = () => {
  const [activeNumber, setActiveNumber] = useState(15);
  const handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>) =>
    setActiveNumber(parseInt(e.currentTarget.value, 10));

  const min = 0;
  const max = 100;
  const step = 5;
  return (
    <div>
      <div className={mark}>
        <Label className={markMin}>{min}</Label>
        <Label className={markMax}>{max}</Label>
      </div>
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
        <Label className={text}>value: </Label>
        <Label className={value}>{activeNumber}</Label>
      </div>
    </div>
  );
};

export default InputRange;
