// @flow
import type { System } from '../../common/ecs/System';
import type World from '../../common/ecs/World';
import type { Server } from '../server';
import NetworkSystem from './Network';

export default (
  world: World,
  server: Server,
): System[] => [
  NetworkSystem(world, server),
].map(S => new S());
