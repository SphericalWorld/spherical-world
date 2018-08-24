// @flow
import type World from '../ecs/World';
import type Network from '../network';
import type { System } from './System';
import type { Terrain } from '../Terrain/Terrain';
import TerrainSystem from './Terrain';
import BlockRemoveSystem from './BlockRemove';
import DayNightCycleSystem from './DayNightCycle';
import CameraSystem from './Camera';
import DrawSystem from './Draw';
import HudSystem from './Hud';
import NetworkSystem from './Network';

export default (world: World, terrain: Terrain, network: Network, time, store): System[] => [
  TerrainSystem(world, network, terrain),
  BlockRemoveSystem(world),
  DayNightCycleSystem(world, time),
  CameraSystem(world),
  DrawSystem(world, terrain, time),
  HudSystem(world, store),
  NetworkSystem(world, network),
].map(S => new S());
