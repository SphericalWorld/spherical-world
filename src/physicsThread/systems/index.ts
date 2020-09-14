import type { System } from '../../../common/ecs/System';
import type Terrain from '../Terrain/Terrain';
import TerrainSystem from './Terrain';
import TransformSystem from './Transform';
import RaytraceSystem from './Raytrace';
import GravitySystem from './Gravity';
import VelocitySystem from './VelocitySystem';
import PhysicsSystem from './Physics';
import UserControlSystem from './UserControlSystem';
import type { WorldPhysicsThread } from '../../Events';

export default (world: WorldPhysicsThread, terrain: Terrain): System[] => [
  TerrainSystem(world, terrain),
  TransformSystem(world),
  UserControlSystem(world, terrain),
  GravitySystem(world, terrain),
  VelocitySystem(world),
  PhysicsSystem(world, terrain),
  RaytraceSystem(world, terrain),
];
