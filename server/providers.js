// @flow
import World from '../common/ecs/World';
import { THREAD_MAIN } from '../src/Thread/threadConstants';
import { playerProvider } from './player';
import serverProvider from './server';
import socketHandlersProvider from './socketHandlers';
import systemsProvider from './systems';
import * as componentsProvider from './components';

const createECS = () => {
  const world = new World(THREAD_MAIN);
  world.registerComponentTypes(...Object.values(componentsProvider));
  setInterval(() => world.update(1000 / 60), 1000 / 60);
  return world;
};

const mainProvider = () => {
  const world = createECS();
  const Player = playerProvider(world);
  const socketHandlers = new (socketHandlersProvider(Player))();
  const Server = serverProvider(socketHandlers);
  const server = new Server();
  world.registerSystem(...systemsProvider(world, server));
  return server;
};

export default mainProvider;
