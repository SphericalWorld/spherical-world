// @flow
import World from '../common/ecs/World';
import { THREAD_MAIN } from '../src/Thread/threadConstants';
import { playerProvider } from './player';
import serverProvider from './server';
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
  const createPlayer = playerProvider(world);
  const Server = serverProvider(world);
  const server = new Server();
  world.registerSystem(...systemsProvider(world, server, createPlayer));
  return server;
};

export default mainProvider;
