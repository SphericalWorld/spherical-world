import React from 'react';
import { Provider } from 'react-redux';
// eslint-disable-next-line
import PhysicsThread from 'worker-loader!./physicsThread/index';
// eslint-disable-next-line
import ChunksHandlerThread from 'worker-loader!./chunksHandlerThread/index';
import store from './store/store';
import Network from './network';
import Hud from './hud/Hud';
import { Transform } from './components';

const physicsThread = new PhysicsThread();
const chunksHandlerThread = new ChunksHandlerThread();
const network = new Network();

// TODO: proper memory allocator
const data = new SharedArrayBuffer(1024 * 1024 * 10); // eslint-disable-line no-undef
physicsThread.postMessage({ type: 'dataArray', payload: data });
Transform.memory = data;
// console.log(data);
// componentsProvider.Transform.memory = data

const App = () => (
  <Provider store={store}>
    <div>
      <section id="hud">
        <Hud />
        <div id="addons" />
      </section>
      <canvas id="glcanvas">
        Your browser doesn&apos;t appear to support the HTML5
        <code>&lt;canvas&gt;</code>
        element.
      </canvas>
      <canvas id="texture-canvas" />
    </div>
  </Provider>
);

export const start = async () => {
  const mainProvider = require('./providers').default;

  const Main = await mainProvider(store, network, {
    physicsThread,
    chunksHandlerThread,
  });
  return new Main();
};

export default App;
