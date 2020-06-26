// @flow strct
import React from 'react';
import { storiesOf } from '@storybook/react';
import Portal from './Portal';

storiesOf('Portal', module).add('Portal', () => (
  <>
    <div>
      parent
      <Portal>
        <div>child in a portal</div>
      </Portal>
      <Portal
        style={{
          color: '#F00',
        }}
      >
        <div>child in a portal with passed props</div>
      </Portal>
    </div>
  </>
));
