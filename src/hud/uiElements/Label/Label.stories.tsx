import React from 'react';
import { storiesOf } from '@storybook/react';
import Label from './Label';

storiesOf('Label', module).add('Label', () => (
  <>
    <Label size="big">Big label</Label>
    <br />
    <Label>Small label</Label>
  </>
));
