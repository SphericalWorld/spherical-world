// @flow strict
import React from 'react';
import { storiesOf } from '@storybook/react';
import InventorySlot from './InventorySlot';

storiesOf('InventorySlot', module)
  .add('InventorySlot', () =>
  <>
    Normal:
    <InventorySlot slot={{ count: 1, id: '1', icon: 'ironIngot' }} />
    Selected:
    <InventorySlot slot={{ count: 1, id: '1', icon: 'diamond' }} selected />
  </>);
