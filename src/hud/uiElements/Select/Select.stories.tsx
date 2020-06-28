import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Select from './Select';

const items = [
  { value: '0', text: 'all' },
  { value: '1', text: 'articles' },
  { value: '2', text: 'products' },
  { value: '3', text: 'articles' },
  { value: '4', text: 'products' },
  { value: '5', text: 'articles' },
  { value: '6', text: 'products' },
];

storiesOf('Select', module).add('Select', () => (
  <>
    <br />
    <Select options={items} onSelect={(value) => action(`selected ${String(value)}`)} />
  </>
));
