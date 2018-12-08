// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import Checkbox from './Checkbox';

storiesOf('Checkbox', module)
  .add('Checkbox', () => (
    <>
      <Checkbox size="big"> CheckBox Big</Checkbox>
      <br />
      <Checkbox size="small"> CheckBox small</Checkbox>
    </>));
