import { storiesOf } from '@storybook/react';
import InputRange from './InputRange';

storiesOf('Input Range', module).add('Input Range', () => (
  <>
    <br />
    <InputRange max={100} step={5} />
  </>
));
