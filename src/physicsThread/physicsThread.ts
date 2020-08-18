import Thread from '../Thread/Thread';
import Terrain from './Terrain';
import systemsProvider from './systems';
import {
  BlockRemover,
  Camera,
  Collider,
  Gravity,
  Physics,
  Player,
  Raytracer,
  Skybox,
  Transform,
  UserControlled,
  Velocity,
  Visual,
  Joint,
  Item,
  NetworkSync,
  Inventory,
} from '../components';
import { World } from '../../common/ecs';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

const world = new World(THREAD_PHYSICS);
const terrain = new Terrain();

class PhysicsThread {
  constructor() {
    world.registerComponentTypes(
      BlockRemover,
      Camera,
      Collider,
      Gravity,
      Physics,
      Player,
      Raytracer,
      Skybox,
      Transform,
      UserControlled,
      Velocity,
      Visual,
      Joint,
      Item,
      NetworkSync,
      Inventory,
    );
    // eslint-disable-next-line no-restricted-globals
    world.registerThread(new Thread(THREAD_MAIN, self));
    world.registerSystem(...systemsProvider(world, terrain));
  }
}

export default new PhysicsThread();
