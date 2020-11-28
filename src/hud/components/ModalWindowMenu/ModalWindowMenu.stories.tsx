import { storiesOf } from '@storybook/react';
import ModalWindowMenu from './ModalWindowMenu';

storiesOf('Modal Window Menu', module).add('Modal Window Menu', () => (
  <ModalWindowMenu caption="Header text">
    {new Array(5).fill('content Menu')}
    {new Array(5).fill(
      <>
        <br />
        content Menu
      </>,
    )}
  </ModalWindowMenu>
));
