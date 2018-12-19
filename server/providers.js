// @flow strict
import World from '../common/ecs/World';
import { THREAD_MAIN } from '../src/Thread/threadConstants';
import createItem from './item';
import { playerProvider } from './player';
import serverProvider from './server';
import systemsProvider from './systems';
import * as componentsProvider from './components';
import Terrain from './terrain/Terrain';

const createECS = () => {
  const world = new World(THREAD_MAIN);
  world.registerComponentTypes(...Object.values(componentsProvider));
  setInterval(() => world.update(1000 / 60), 1000 / 60);
  return world;
};

const mainProvider = () => {
  const world = createECS();
  const createPlayer = playerProvider(world);
  const Server = serverProvider(world, Terrain(createItem(world)));
  const server = new Server();
  world.registerSystem(...systemsProvider(world, server, createPlayer));
  return server;
};

export default mainProvider;
