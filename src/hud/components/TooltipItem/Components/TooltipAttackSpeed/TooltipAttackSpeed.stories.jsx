// @flow strict
import React from 'react';
import { storiesOf } from '@storybook/react';
import TooltipAttackSpeed from './TooltipAttackSpeed';

const item = {
  name: 'diamonds',
  rareness: 2,
  damage: 2,
  attackSpeed: 50,
};

storiesOf('TooltipAttackSpeed', module)
  .add('TooltipAttackSpeed', () => (
    <TooltipAttackSpeed attackSpeed={item.attackSpeed} />
  ));
