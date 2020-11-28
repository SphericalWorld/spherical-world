import { useState } from 'react';
import Label from '../Label';
import { inputRange, valueLabel, valueDescript, formInputRange } from './inputRange.module.css';

type Props = Readonly<{
  value?: number;
  className?: string;
  min?: number;
  max: number;
  step?: number;
}>;

const InputRange = ({ value = 15, className = '', min = 0, max, step = 1 }: Props): JSX.Element => {
  const [activeNumber, setActiveNumber] = useState(value);
  const handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>) =>
    setActiveNumber(parseInt(e.currentTarget.value, 10));

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
