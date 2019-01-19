// @flow strict
import React from 'react';
import { storiesOf } from '@storybook/react';
import ProgressBar from './ProgressBar';

storiesOf('Progress Bar', module)
  .add('Progress Bar', () => (
    <>
      <br />
        HP &gt; 40%
      <ProgressBar currentValue={70} maxValue={100} />
      <br />
        HP &lt; 40%
      <ProgressBar currentValue={35} maxValue={100} />
      <br />
        Mana
      <ProgressBar type="mana" currentValue={203} maxValue={320} />
    </>
  ));
