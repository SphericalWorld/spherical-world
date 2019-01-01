// @flow strict
import React, { useState } from 'react';
import {
  select,
} from './select.module.scss';

type Item<ValueType> = {|
  +value: ValueType;
  +text: string;
|}

type Props<ValueType> = {|
  +options: $ReadOnlyArray<Item<ValueType>>;
  +onSelect: (value: ValueType) => mixed;
|}

const Select = <ValueType>({ options, onSelect }: Props<ValueType>) => {
  const [selectedValue, setSelectedValue] = useState(3);
  const handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
    onSelect(options[parseInt(e.target.value, 10)].value);
  };

  return (
    <div>
      <select className={select} onChange={handleInputChange} value={selectedValue}>
        {
        options.map((item, index) => (
          <option key={String(item.value)} value={index}>
            {item.text}
          </option>
        ))
      }
      </select>
    </div>
  );
};

export default Select;
