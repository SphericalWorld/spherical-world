import type Network from '../network';
import type { Time } from '../Time/Time';
import type { System } from '../../common/ecs/System';
import type Terrain from '../Terrain/Terrain';
import type { Store } from '../store/store';
import TerrainSystem from './Terrain';
import BlockRemoveSystem from './BlockRemove';
import DayNightCycleSystem from './DayNightCycle';
import CameraSystem from './Camera';
import DrawSystem from './Draw';
import HudSystem from './Hud';
import NetworkSystem from './Network';
import DropableSystem from './Dropable';
import ScriptingSystem from './ScriptingSystem';
import type { WorldMainThread } from '../Events';

export default (
  world: WorldMainThread,
  terrain: Terrain,
  network: Network,
  time: Time,
  store: Store,
): System[] => [
  TerrainSystem(world, network, terrain),
  BlockRemoveSystem(world, network),
  DayNightCycleSystem(world, time),
  CameraSystem(world),
  DrawSystem(world, terrain, time),
  NetworkSystem(world, network),
  DropableSystem(world),
  ScriptingSystem(world),
  HudSystem(world, store, network),
];
