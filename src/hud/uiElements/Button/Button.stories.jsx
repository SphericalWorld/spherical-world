// @flow strict
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from './Button';

storiesOf('Button', module)
  .add('Button', () => (
    <>
      Big button:
      <Button onClick={action('clicked')}>button</Button>
      <br />
      Small button:
      <Button size="small" onClick={action('clicked')}>small</Button>
    </>));
