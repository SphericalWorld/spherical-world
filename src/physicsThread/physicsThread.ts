import Thread from '../Thread/Thread';
import Terrain from './Terrain';
import systemsProvider from './systems';
import * as componentsProvider from '../components';
import { World } from '../../common/ecs';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

const world = new World(THREAD_PHYSICS);
const terrain = new Terrain();

class PhysicsThread {
  constructor() {
    world.registerComponentTypes(...Object.values(componentsProvider));
    // eslint-disable-next-line no-restricted-globals
    world.registerThread(new Thread(THREAD_MAIN, self));
    world.registerSystem(...systemsProvider(world, terrain));
    setInterval(() => world.update(1000 / 60), 1000 / 60);
  }
}

export default new PhysicsThread();
