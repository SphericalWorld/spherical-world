import { vec3, quat } from 'gl-matrix';
import type Terrain from '../Terrain';
import { getBlock } from '../../../common/terrain';
import { blocksInfo } from '../../blocks/blockInfo';
import {
  PLAYER_MOVED,
  PLAYER_STOPED_MOVE,
  DIRECTION_FORWARD,
  DIRECTION_BACK,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  PLAYER_RUN,
  PLAYER_STOPED_RUN,
  PLAYER_JUMPED,
  PLAYER_STOPED_JUMP,
} from '../../player/events';
import type { System } from '../../../common/ecs/System';
import { World } from '../../../common/ecs';
import Transform from '../../components/Transform';
import Velocity from '../../components/Velocity';
import UserControlled from '../../components/UserControlled';

const getAngle = (x, z) => Math.atan2(-z, x);

const setMove = (userControls: UserControlled, direction, value: boolean): UserControlled => {
  switch (direction) {
    case DIRECTION_FORWARD: userControls.movingForward = value;
      break;
    case DIRECTION_BACK: userControls.movingBackward = value;
      break;
    case DIRECTION_LEFT: userControls.movingLeft = value;
      break;
    case DIRECTION_RIGHT: userControls.movingRight = value;
      break;
    default:
  }
  return userControls;
};

export default (world: World, terrain: Terrain): System => {
  const components = world.createSelector([Transform, Velocity, UserControlled]);
  const moveEvents = world.events
    .filter(el => el.type === PLAYER_MOVED || el.type === PLAYER_STOPED_MOVE)
    .subscribeQueue();

  const jumpEvents = world.events
    .filter(el => el.type === PLAYER_JUMPED || el.type === PLAYER_STOPED_JUMP)
    .map(el => el.type === PLAYER_JUMPED)
    .subscribeQueue();

  const runEvents = world.events
    .filter(el => el.type === PLAYER_RUN || el.type === PLAYER_STOPED_RUN)
    .map(el => el.type === PLAYER_RUN)
    .subscribeQueue();

  const userControlSystem = (delta: number) => {
    if (!components.length) {
      return;
    }
    const [{
      id, transform, velocity, userControlled: userControls,
    }] = components;

    moveEvents.events.reduce((controls, { type, payload: { direction } }) =>
      setMove(controls, direction, type === PLAYER_MOVED), userControls);
    runEvents.events.reduce((controls, isRunning) => {
      controls.isRunning = isRunning;
      return controls;
    }, userControls);
    userControls.isJumping = jumpEvents.events.reduce((_, isJumping) => isJumping, userControls.isJumping);

    // // 1.570796327rad == 90*
    // let deltaX = -delta * speed * (running + 1) * (Math.sin(horizontalRotate) * movingX + (Math.sin(horizontalRotate + 1.570796327)) * movingZ);
    // let deltaZ = -delta * speed * (running + 1) * (Math.cos(horizontalRotate) * movingX + (Math.cos(horizontalRotate + 1.570796327)) * movingZ);
    //

    // console.log(userActions)
    // vec3.scaleAndAdd(velocity.linear, velocity.linear, transform.rotation, delta*0.01);
    // vec3.transformQuat(velocity.linear, velocity.linear, quat.rotateX(quat.create(), quat.create(), transform.rotation.x));
    // console.log( quat.rotateX(quat.create(), quat.create(), transform.rotation.x))


    if (userControls.movingForward || userControls.movingBackward || userControls.movingLeft || userControls.movingRight) {
      const movingX = Number(userControls.movingForward) - Number(userControls.movingBackward);
      const movingZ = Number(userControls.movingLeft) - Number(userControls.movingRight);
      const angle = getAngle(movingX, movingZ);
      const rotation = quat.rotateY(quat.create(), transform.rotation, angle);

      const v = vec3.fromValues(1, 0, 0);
      vec3.transformQuat(v, v, rotation);

      // const v2 = vec3.fromValues(0, 1, 0);
      // vec3.transformQuat(v2, v2, rotation);

      const v3 = vec3.fromValues(0, 0, 1);
      vec3.transformQuat(v3, v3, rotation);

      userControls.velocity = [-v[2], 0, -v3[2]];
      vec3.scale(userControls.velocity, userControls.velocity, 10 * (userControls.isRunning ? 2 : 1));
    } else {
      vec3.set(userControls.velocity, 0, 0, 0);
    }
    getBlock(terrain)(transform.translation[0], transform.translation[1] - 1, transform.translation[2])
      .map((block) => {
        if (blocksInfo[block].needPhysics && userControls.isJumping && velocity.linear[1] === 0) {
          velocity.linear[1] += 5;
        } else if (block === 127) {
          userControls.velocity[1] = userControls.isJumping ? 5 : 0;
        }
      });

    moveEvents.clear();
    jumpEvents.clear();
    runEvents.clear();
    return [[id, userControls, velocity]];
  };
  return userControlSystem;
};
