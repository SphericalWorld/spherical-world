import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withBackgrounds } from '@storybook/addon-backgrounds';

const importAll = (context) =>
  context.keys().forEach(context);

const mainContext = require.context(
  '../src',
  true,
  /\.stories\.jsx?$/
);

function loadStories() {
  importAll(mainContext);
}

addDecorator(
  withBackgrounds([
    { name: 'main', value: '#59868a', default: true },
    { name: 'white', value: '#fff' },
    { name: 'black', value: '#000' },
  ])
);

configure(loadStories, module);
