// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import Checkbox from './Checkbox';

storiesOf('Checkbox', module)
  .add('Checkbox', () => (
    <>
      <Checkbox size="big"> CheckBox Big</Checkbox>
      <br />
      <Checkbox size="small"> CheckBox small</Checkbox>
    </>));
