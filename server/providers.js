// @flow
import World from '../common/ecs/World';
import Transform from '../src/app/components/Transform';
import { THREAD_MAIN } from '../src/app/Thread/threadConstants';
import { playerProvider } from './player';
import serverProvider from './server';
import socketHandlersProvider from './socketHandlers';

const createECS = () => {
  const world = new World(THREAD_MAIN);
  world.registerComponentTypes(Transform);
  return world;
};

const mainProvider = () => {
  const world = createECS();
  const Player = playerProvider(world);
  const socketHandlers = new (socketHandlersProvider(Player))();
  const Server = serverProvider(socketHandlers);
  return new Server();
};

export default mainProvider;
