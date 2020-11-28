import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ModalWindow from './ModalWindow';

storiesOf('Modal Window', module).add('Modal Window', () => (
  <>
    <ModalWindow caption="Header text" onClose={action('closed')}>
      {new Array(10).fill(
        <>
          content
          <br />
        </>,
      )}
    </ModalWindow>
  </>
));
