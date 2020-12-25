import { vec3, quat } from 'gl-matrix';
import type Terrain from '../Terrain';
import { getBlock } from '../../../common/terrain';
import { blocksInfo } from '../../blocks/blocksInfoAllThreads';
import type { System } from '../../../common/ecs/System';
import { Transform, Velocity, UserControlled } from '../../components';
import type { WorldPhysicsThread } from '../../Events';
import { InputAction } from '../../Input/InputAction';
import { InputEvent } from '../../../common/constants/input/eventTypes';

const getAngle = (x: number, z: number): number => Math.atan2(-z, x);

const getMovingAxes = () => {
  const x =
    Number(InputAction.isActive(InputEvent.playerMoveForward)) -
    Number(InputAction.isActive(InputEvent.playerMoveBackward));
  const z =
    Number(InputAction.isActive(InputEvent.playerMoveLeft)) -
    Number(InputAction.isActive(InputEvent.playerMoveRight));
  return [x, z];
};

export default (world: WorldPhysicsThread, terrain: Terrain): System => {
  const components = world.createSelector([Transform, Velocity, UserControlled]);
  const rotation = quat.create();
  const vX = vec3.fromValues(1, 0, 0);
  const vZ = vec3.fromValues(0, 0, 1);
  const vXrotated = vec3.create();
  const vZrotated = vec3.create();

  const userControlSystem = () => {
    if (!components.length) {
      return;
    }
    const [{ transform, velocity, userControlled: userControls }] = components;

    const movingAxes = getMovingAxes();
    const isJumping = InputAction.isActive(InputEvent.playerJump);

    if (movingAxes[0] || movingAxes[1]) {
      const isRunning = InputAction.isActive(InputEvent.playerRun);
      const [movingX, movingZ] = movingAxes;
      const angle = getAngle(movingX, movingZ);
      quat.rotateY(rotation, transform.rotation, angle);

      vec3.transformQuat(vXrotated, vX, rotation);
      vec3.transformQuat(vZrotated, vZ, rotation);

      vec3.set(userControls.velocity, -vXrotated[2], 0, -vZrotated[2]);
      const velocityScale = 10 * (isRunning ? 2 : 1);
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
      if (blocksInfo[block].needPhysics && isJumping && velocity.linear[1] === 0) {
        velocity.linear[1] += 5;
      } else if (block === 127) {
        userControls.velocity[1] = isJumping ? 5 : 0;
      }
    }
  };
  return userControlSystem;
};
