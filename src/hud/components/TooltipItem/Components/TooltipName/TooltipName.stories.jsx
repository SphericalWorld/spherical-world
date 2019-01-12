// @flow strict
import React from 'react';
import { storiesOf } from '@storybook/react';
import TooltipName from './TooltipName';

const item = {
  name: 'diamonds',
  rareness: 2,
};

storiesOf('TooltipName', module)
  .add('TooltipName', () => (
    <TooltipName {...item} />
  ));
