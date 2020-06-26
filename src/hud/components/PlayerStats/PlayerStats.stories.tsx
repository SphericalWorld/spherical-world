import React from 'react';
import { storiesOf } from '@storybook/react';
import PlayerStats from './PlayerStats';

storiesOf('PlayerStats', module)
  .add('PlayerStats', () => (
    <>
      <br />
      <PlayerStats />
    </>
  ));
