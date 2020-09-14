import { vec3, quat } from 'gl-matrix';
import type Terrain from '../Terrain';
import { getBlock } from '../../../common/terrain';
import { blocksInfo } from '../../blocks/blocksInfoAllThreads';
import {
  DIRECTION_FORWARD,
  DIRECTION_BACK,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
} from '../../player/events';
import type { System } from '../../../common/ecs/System';
import Transform from '../../components/Transform';
import Velocity from '../../components/Velocity';
import UserControlled from '../../components/UserControlled';
import { GameEvent, WorldPhysicsThread } from '../../Events';

const getAngle = (x: number, z: number): number => Math.atan2(-z, x);

const setMove = (userControls: UserControlled, direction, value: boolean): UserControlled => {
  switch (direction) {
    case DIRECTION_FORWARD:
      userControls.movingAxes[0] = value
        ? userControls.movingAxes[0] + 1
        : userControls.movingAxes[0] - 1;
      break;
    case DIRECTION_BACK:
      userControls.movingAxes[0] = value
        ? userControls.movingAxes[0] - 1
        : userControls.movingAxes[0] + 1;
      break;
    case DIRECTION_LEFT:
      userControls.movingAxes[1] = value
        ? userControls.movingAxes[1] + 1
        : userControls.movingAxes[1] - 1;

      break;
    case DIRECTION_RIGHT:
      userControls.movingAxes[1] = value
        ? userControls.movingAxes[1] - 1
        : userControls.movingAxes[1] + 1;
      break;
    default:
  }
  return userControls;
};

export default (world: WorldPhysicsThread, terrain: Terrain): System => {
  const components = world.createSelector([Transform, Velocity, UserControlled]);
  const moveEvents = world.events
    .filter((e) => (e.type === GameEvent.playerMoved || e.type === GameEvent.playerStopedMove) && e)
    .subscribeQueue();

  const jumpEvents = world.events
    .filter(
      (e) => (e.type === GameEvent.playerJumped || e.type === GameEvent.playerStopedJump) && e,
    )
    .map((el) => el.type === GameEvent.playerJumped)
    .subscribeQueue();

  const runEvents = world.events
    .filter((e) => (e.type === GameEvent.playerRun || e.type === GameEvent.playerStopedRun) && e)
    .map((el) => el.type === GameEvent.playerRun)
    .subscribeQueue();

  const rotation = quat.create();
  const vX = vec3.fromValues(1, 0, 0);
  const vZ = vec3.fromValues(0, 0, 1);
  const vXrotated = vec3.create();
  const vZrotated = vec3.create();

  const userControlSystem = (delta: number) => {
    if (!components.length) {
      return;
    }
    const [{ transform, velocity, userControlled: userControls }] = components;

    moveEvents.events.reduce(
      (controls, { type, payload: { direction } }) =>
        setMove(controls, direction, type === GameEvent.playerMoved),
      userControls,
    );
    runEvents.events.reduce((controls, isRunning) => {
      controls.isRunning = isRunning;
      return controls;
    }, userControls);
    userControls.isJumping = jumpEvents.events.reduce(
      (_, isJumping) => isJumping,
      userControls.isJumping,
    );

    // // 1.570796327rad == 90*
    // let deltaX = -delta * speed * (running + 1) * (Math.sin(horizontalRotate) * movingX + (Math.sin(horizontalRotate + 1.570796327)) * movingZ);
    // let deltaZ = -delta * speed * (running + 1) * (Math.cos(horizontalRotate) * movingX + (Math.cos(horizontalRotate + 1.570796327)) * movingZ);
    //

    // vec3.scaleAndAdd(velocity.linear, velocity.linear, transform.rotation, delta*0.01);
    // vec3.transformQuat(velocity.linear, velocity.linear, quat.rotateX(quat.create(), quat.create(), transform.rotation.x));
    // console.log( quat.rotateX(quat.create(), quat.create(), transform.rotation.x))

    if (userControls.movingAxes[0] || userControls.movingAxes[1]) {
      const [movingX, movingZ] = userControls.movingAxes;
      const angle = getAngle(movingX, movingZ);
      quat.rotateY(rotation, transform.rotation, angle);

      vec3.transformQuat(vXrotated, vX, rotation);
      vec3.transformQuat(vZrotated, vZ, rotation);

      vec3.set(userControls.velocity, -vXrotated[2], 0, -vZrotated[2]);
      const velocityScale = 10 * (userControls.isRunning ? 2 : 1);
      vec3.scale(userControls.velocity, userControls.velocity, velocityScale);
    } else {
      vec3.set(userControls.velocity, 0, 0, 0);
    }
    const block = getBlock(terrain)(
      transform.translation[0],
      transform.translation[1] - 1,
      transform.translation[2],
    );
    if (block) {
      if (blocksInfo[block].needPhysics && userControls.isJumping && velocity.linear[1] === 0) {
        velocity.linear[1] += 5;
      } else if (block === 127) {
        userControls.velocity[1] = userControls.isJumping ? 5 : 0;
      }
    }

    moveEvents.clear();
    jumpEvents.clear();
    runEvents.clear();
  };
  return userControlSystem;
};
