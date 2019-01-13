// @flow strict
import React from 'react';
import { storiesOf } from '@storybook/react';
import TooltipImage from './TooltipImage';

const item = {
  name: 'diamonds',
  rareness: 2,
  damage: 2,
  image: 'diamond',
};

storiesOf('TooltipImage', module)
  .add('TooltipImage', () => (
    <TooltipImage icon={item.image} />
  ));
