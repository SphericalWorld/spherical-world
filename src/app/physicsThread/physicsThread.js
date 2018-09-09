// @flow
import Thread from '../Thread/Thread';
import terrainBaseProvider from '../Terrain/TerrainBase';
import terrainProvider from './Terrain';
import Chunk from './Terrain/Chunk/Chunk';
import systemsProvider from './systems';
import * as componentsProvider from '../components';
import { World } from '../../../common/ecs';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

const TerrainBase = terrainBaseProvider(Chunk);
const Terrain = terrainProvider(TerrainBase);
const world = new World(THREAD_PHYSICS);
const terrain = new Terrain();

class PhysicsThread {
  constructor() {
    world.registerComponentTypes(...Object.values(componentsProvider));
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
