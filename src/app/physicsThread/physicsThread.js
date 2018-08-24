// @flow
import Thread from '../Thread/Thread';
import terrainBaseProvider from '../Terrain/TerrainBase';
import terrainProvider from './Terrain';
import Chunk from './Terrain/Chunk/Chunk';

import systemsProvider from './systems';

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
const TerrainBase = terrainBaseProvider(Chunk);
const Terrain = terrainProvider(TerrainBase);

const terrain = new Terrain();

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
    world.registerThread(new Thread(THREAD_MAIN, self));
    world.registerSystem(...systemsProvider(world, terrain));
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
