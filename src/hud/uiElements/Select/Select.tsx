import React, { useState } from 'react';
import { select } from './select.module.scss';

type Item<ValueType> = Readonly<{
  value: ValueType;
  text: string;
}>;

type Props<ValueType> = Readonly<{
  options: ReadonlyArray<Item<ValueType>>;
  onSelect: (value: ValueType) => unknown;
}>;

const Select = <ValueType extends any>({ options, onSelect }: Props<ValueType>): JSX.Element => {
  const [selectedValue, setSelectedValue] = useState(3);
  const handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
    onSelect(options[parseInt(e.target.value, 10)].value);
  };

  return (
    <div>
      <select className={select} onChange={handleInputChange} value={selectedValue}>
        {options.map((item, index) => (
          <option key={String(item.value)} value={index}>
            {item.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
