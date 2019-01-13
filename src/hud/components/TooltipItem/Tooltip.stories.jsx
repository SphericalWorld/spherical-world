// @flow strict
import React from 'react';
import { storiesOf } from '@storybook/react';
import Tooltip from './Tooltip';

const item = {
  name: 'diamonds',
  rareness: 2,
  damage: 2,
  speedAttack: 30,
  image: 'diamond',
  attackSpeed: 319,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat enim ex, in dignissim felis gravida vitae. Etiam elementum arcu tempus euismod commodo. Fusce lobortis dui nec bibendum consequat. Sed mollis enim sed justo tempor facilisis.',
};

storiesOf('Tooltip', module)
  .add('Tooltip item', () => (
    <Tooltip item={item} />
  ));
