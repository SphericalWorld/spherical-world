import React from 'react';
import { Provider } from 'react-redux';
// eslint-disable-next-line
import PhysicsThread from 'worker-loader!./physicsThread/index';
// eslint-disable-next-line
import ChunksHandlerThread from 'worker-loader!./chunksHandlerThread/index';
import store from './store/store';
import Network from './network';
import Hud from './hud/Hud';
import { SocketProvider } from './hud/utils/socket/Socket';

const physicsThread = new PhysicsThread();
const chunksHandlerThread = new ChunksHandlerThread();
const network = new Network();

const App = (): JSX.Element => (
  <Provider store={store}>
    <SocketProvider value={network}>
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
    </SocketProvider>
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
