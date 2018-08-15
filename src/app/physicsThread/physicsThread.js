// @flow
import configureStore from './store/configureStore';
import terrainBaseProvider from '../Terrain/TerrainBase';
import terrainProvider from './Terrain';
import chunkProvider from './Terrain/Chunk';

import terrainSystemProvider from './systems/Terrain';
import raytraceProvider from './systems/Raytrace';
import gravitySystemProvider from './systems/Gravity';
import physicsSystemProvider from './systems/Physics';
import velocitySystemProvider from './systems/VelocitySystem';
import userControlSystemProvider from './systems/UserControlSystem';

import Transform from '../components/Transform';
import Raytracer from '../components/Raytracer';
import Gravity from '../components/Gravity';
import Velocity from '../components/Velocity';
import Physics from '../components/Physics';
import UserControlled from '../components/UserControlled';
import Camera from '../components/Camera';
import Collider from '../components/Collider';

import { World } from '../ecs';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

const world = new World(THREAD_PHYSICS);

const store = configureStore();

const Chunk = chunkProvider(null);

const TerrainBase = terrainBaseProvider(Chunk);
const Terrain = terrainProvider(store, Chunk, TerrainBase);

const terrain = new Terrain();

const TerrainSystem = terrainSystemProvider(world, terrain);
const Raytrace = raytraceProvider(world, Chunk);
const GravitySystem = gravitySystemProvider(world);
const VelocitySystem = velocitySystemProvider(world);
const PhysicsSystem = physicsSystemProvider(world, terrain);
const UserControlSystem = userControlSystemProvider(world, terrain);

class PhysicsThread {
  constructor() {
    world.registerComponentTypes(
      Transform,
      Raytracer,
      Gravity,
      Physics,
      Collider,
      Velocity,
      UserControlled,
      Camera,
    );
    world.registerThread(THREAD_MAIN, self);
    world.registerSystem(
      new TerrainSystem(),
      new UserControlSystem(),
      new GravitySystem(),
      new VelocitySystem(),
      new PhysicsSystem(),
      new Raytrace(terrain),
    );
  }

  physicsLoop() {
    // for (const [id, player] of this.players.entries()) {
    //   player.calcPhysics(elapsed);
    //   players[id] = {
    //     blockInDown: player.blockInDown,
    //     blockInUp: player.blockInUp,
    //   };
    // }
  }
}

export default new PhysicsThread();

//
// self.registerMessageHandler('TERRAIN_PLACED_BLOCK', ({
//   payload: {
//     geoId, x, y, z, blockId, plane,
//   },
// }) => {
//   terrain.chunks.get(geoId).putBlock(x, y, z, blockId, plane);
// });
