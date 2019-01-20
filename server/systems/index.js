// @flow strict
import type { System } from '../../common/ecs/System';
import type World from '../../common/ecs/World';
import type { Server } from '../server';
import type { CreatePlayer } from '../player';
import { type DataStorage } from '../dataStorage';
import NetworkSystem from './Network';
import PlayerSystem from './Player';
import DropableSystem from './Dropable';
import NetworkSyncSystem from './NetworkSync';

export default (
  world: World,
  server: Server,
  createPlayer: CreatePlayer,
  ds: DataStorage,
): System[] => [
  NetworkSystem(world, server, ds, createPlayer),
  PlayerSystem(world, server, ds),
  DropableSystem(world),
  NetworkSyncSystem(world, server),
];
