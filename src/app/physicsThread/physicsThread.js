// @flow
import {
  playerMovedObservable,
  PLAYER_MOVED,
  playerStopedMoveObservable,
  PLAYER_STOPED_MOVE,
} from '../player/events';
import configureStore from './store/configureStore';
import terrainBaseProvider from '../Terrain/TerrainBase';
import terrainProvider from './Terrain';
import chunkProvider from './Terrain/Chunk';

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

import { World } from '../ecs';
import { THREAD_MAIN } from '../Thread/threadConstants';

const world = new World();

const store = configureStore();

const Chunk = chunkProvider(null);

const TerrainBase = terrainBaseProvider(Chunk);
const Terrain = terrainProvider(store, Chunk, TerrainBase);

const terrain = new Terrain();

const Raytrace = raytraceProvider(store, world, Chunk);
const GravitySystem = gravitySystemProvider(world);
const VelocitySystem = velocitySystemProvider(world);
const PhysicsSystem = physicsSystemProvider(world, terrain, Chunk);
const UserControlSystem = userControlSystemProvider(world);
// throw add direction to move event and rename observables
world.subscribe((event) => {
  if (event.type === PLAYER_MOVED || event.type === PLAYER_STOPED_MOVE) {
    playerMovedObservable.emit(event);
  }
});

class PhysicsThread {
  lastTime: number = Date.now();
  terrain: Terrain = terrain;

  constructor() {
    world.registerComponentTypes(
      Transform,
      Raytracer,
      Gravity,
      Physics,
      Velocity,
      UserControlled,
    );
    world.registerThread(THREAD_MAIN, self);
    world.registerSystem(new Raytrace(this.terrain));
    world.registerSystem(
      new UserControlSystem(),
      new GravitySystem(),
      new VelocitySystem(),
      new PhysicsSystem(),
    );

    self.onMessage = ({ type, payload }) => {
      if (type === 'CREATE_ENTITY') {
        world.addExistedEntity(payload.id, ...payload.components);
      }
      if (type === 'UPDATE_COMPONENTS') {
        world.updateComponents(payload.components);
        world.update(payload.delta);
        if (payload.events && payload.events.length) {
          for (let i = 0; i < payload.events.length; i += 1) {
            world.emitEvent(payload.events[i]);
          }
        }
      }
    };
    // setInterval(this.physicsLoop.bind(this), 1000 / 80);
  }

  physicsLoop() {
    // const timeNow = Date.now();
    // const elapsed = timeNow - this.lastTime;
    //
    // const players = {};
    // for (const [id, player] of this.players.entries()) {
    //   player.calcPhysics(elapsed);
    //   players[id] = {
    //     x: player.x,
    //     y: player.y,
    //     z: player.z,
    //     blockInDown: player.blockInDown,
    //     blockInUp: player.blockInUp,
    //   };
    // }
    // store.dispatch({
    //   type: 'PLAYERS_UPDATED',
    //   payload: { players },
    //   meta: {
    //     worker: true,
    //   },
    // });
    // this.lastTime = timeNow;
  }
}

export default new PhysicsThread();

//
// self.registerMessageHandler('TERRAIN_REMOVED_BLOCK', ({
//   payload: {
//     geoId, x, y, z,
//   },
// }) => {
//   terrain.chunks.get(geoId).setBlock(x, y, z, 0);
// });
//
// self.registerMessageHandler('TERRAIN_PLACED_BLOCK', ({
//   payload: {
//     geoId, x, y, z, blockId, plane,
//   },
// }) => {
//   terrain.chunks.get(geoId).putBlock(x, y, z, blockId, plane);
// });
