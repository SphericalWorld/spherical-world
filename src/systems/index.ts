import type { World } from '../../common/ecs/World';
import type { Input } from '../Input/Input';
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

export default (
  world: World,
  terrain: Terrain,
  network: Network,
  time: Time,
  input: Input,
  store: Store,
): System[] => [
  TerrainSystem(world, network, terrain),
  BlockRemoveSystem(world),
  DayNightCycleSystem(world, time),
  CameraSystem(world, input),
  DrawSystem(world, terrain, time),
  HudSystem(world, store, input),
  NetworkSystem(world, network, input, store),
  DropableSystem(world),
  ScriptingSystem(world),
];
