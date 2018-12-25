// @flow strict
import type World from '../../../common/ecs/World';
import type { System } from '../../../common/ecs/System';
import type Terrain from '../Terrain/Terrain';
import TerrainSystem from './Terrain';
import RaytraceSystem from './Raytrace';
import GravitySystem from './Gravity';
import VelocitySystem from './VelocitySystem';
import PhysicsSystem from './Physics';
import UserControlSystem from './UserControlSystem';

export default (world: World, terrain: Terrain): System[] => [
  TerrainSystem(world, terrain),
  UserControlSystem(world, terrain),
  GravitySystem(world, terrain),
  VelocitySystem(world),
  PhysicsSystem(world, terrain),
  RaytraceSystem(world, terrain),
];
