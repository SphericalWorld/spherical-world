import React, { useState } from 'react';
import classnames from 'classnames';
import {
  input,
  formInputNumber,
  spinButtons,
  spinButton,
  plusSpinButton,
  minusSpinButton,
  spinButtonSign,
} from './inputNumber.module.css';
import { fontMain } from '../../styles/fonts.module.css';
// import Button from '../Button';

type Props = Readonly<{
  className?: string;
  onChange: (number: number) => unknown;
}>;

const InputNumber = ({ className, onChange }: Props): JSX.Element => {
  const [amountToCraft, setAmountToCraft] = useState(1);
  return (
    <div className={`${formInputNumber} ${className}`}>
      <input
        type="number"
        value={amountToCraft}
        onChange={(event) => {
          const parsedValue = Number(event?.target.value);
          setAmountToCraft(parsedValue <= 0 ? 1 : parsedValue);
          onChange(parsedValue <= 0 ? 1 : parsedValue);
        }}
        className={classnames(input, fontMain)}
        min="1"
      />
      <div className={spinButtons}>
        <button
          onClick={() => {
            setAmountToCraft(amountToCraft + 1);
            onChange(amountToCraft + 1);
          }}
          className={classnames(spinButton, plusSpinButton)}
          type="button"
        >
          <span className={spinButtonSign}>▲</span>
        </button>
        <button
          onClick={() => {
            setAmountToCraft(amountToCraft > 1 ? amountToCraft - 1 : 1);
            onChange(amountToCraft > 1 ? amountToCraft - 1 : 1);
          }}
          className={classnames(spinButton, minusSpinButton)}
          type="button"
        >
          <span className={spinButtonSign}>▼</span>
        </button>
      </div>
    </div>
  );
};

export default InputNumber;
