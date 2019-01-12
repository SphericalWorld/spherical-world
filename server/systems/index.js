// @flow strict
import type { System } from '../../common/ecs/System';
import type World from '../../common/ecs/World';
import type { Server } from '../server';
import type { CreatePlayer } from '../player';

import NetworkSystem from './Network';
import PlayerSystem from './Player';
import DropableSystem from './Dropable';

export default (
  world: World,
  server: Server,
  createPlayer: CreatePlayer,
): System[] => [
  NetworkSystem(world, server, createPlayer),
  PlayerSystem(world, server),
  DropableSystem(world),
];
