import { useState } from 'react';
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

type Props = Readonly<{
  className?: string;
  onChange: (number: number) => unknown;
}>;

const InputNumber = ({ className, onChange }: Props): JSX.Element => {
  const [amount, setAmount] = useState(1);
  return (
    <div className={`${formInputNumber} ${className}`}>
      <input
        type="number"
        value={amount}
        onChange={(event) => {
          const parsedValue = Number(event?.target.value);
          setAmount(parsedValue <= 0 ? 1 : parsedValue);
          onChange(parsedValue <= 0 ? 1 : parsedValue);
        }}
        className={classnames(input, fontMain)}
        min="1"
      />
      <div className={spinButtons}>
        <button
          onClick={() => {
            setAmount(amount + 1);
            onChange(amount + 1);
          }}
          className={classnames(spinButton, plusSpinButton)}
          type="button"
        >
          <span className={spinButtonSign}>▲</span>
        </button>
        <button
          onClick={() => {
            setAmount(amount > 1 ? amount - 1 : 1);
            onChange(amount > 1 ? amount - 1 : 1);
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
