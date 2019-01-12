// @flow strict
import React from 'react';
import { storiesOf } from '@storybook/react';
import TooltipDamage from './TooltipDamage';

const item = {
  name: 'diamonds',
  rareness: 2,
  damage: 2,
};

storiesOf('TooltipDamage', module)
  .add('TooltipDamage', () => (
    <TooltipDamage damage={item.damage} />
  ));
