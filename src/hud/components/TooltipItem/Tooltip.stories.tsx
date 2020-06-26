import React from 'react';
import { storiesOf } from '@storybook/react';
import Tooltip from './Tooltip';

const item = {
  name: 'diamonds',
  rareness: 2,
  damage: 2,
  speedAttack: 30,
  icon: 'diamond',
  attackSpeed: 319,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat enim ex, in dignissim felis gravida vitae.',
};

storiesOf('Tooltip', module).add('Tooltip item', () => <Tooltip item={item} />);
