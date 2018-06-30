// @flow
import { vec3, quat } from 'gl-matrix';
import type { Entity } from '../../ecs/Entity';
import GameEventQueue from '../../GameEvent/GameEventQueue';
import {
  playerMovedObservable,
  playerJumpedObservable,
  PLAYER_MOVED,
  DIRECTION_FORWARD,
  DIRECTION_BACK,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  PLAYER_JUMPED,
} from '../../player/events';
import { System } from '../../systems/System';
import { World } from '../../ecs';
import Transform from '../../components/Transform';
import Velocity from '../../components/Velocity';
import UserControlled from '../../components/UserControlled';

const getAngle = (x: number, z: number): number => do {
  if (x === 0) {
    if (z > 0) -90;
    else if (z < 0) 90;
  } else if (x > 0) {
    if (z > 0) -45;
    else if (z < 0) 45;
  } else if (x < 0) {
    if (z > 0) -135;
    else if (z < 0) 135;
    else 180;
  }
} | 0;

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

export default (ecs: World) => {
  class UserControlSystem implements System {
    world: World;
    components: {
      id: Entity,
      transform: Transform,
      velocity: Velocity,
      userControlled: UserControlled,
    }[] = ecs.createSelector([Transform, Velocity, UserControlled]);

    moveEvents: GameEventQueue = new GameEventQueue(playerMovedObservable);
    jumpEvents: GameEventQueue = new GameEventQueue(playerJumpedObservable);

    update(delta: number): Array {
      const result = [];
      const [{
        id, transform, velocity, userControlled: userControls,
      }] = this.components;

      this.moveEvents.events.reduce((controls, { type, data: { direction } }) =>
        setMove(controls, direction, type === PLAYER_MOVED), userControls);

      this.jumpEvents.events.reduce(() => vec3.add(velocity.linear, velocity.linear, [0, 1, 0]), null);

      const movingX = userControls.movingForward - userControls.movingBackward;
      const movingZ = userControls.movingLeft - userControls.movingRight;

      // // 1.570796327rad == 90*
      // let deltaX = -delta * this.speed * (this.running + 1) * (Math.sin(this.horizontalRotate) * movingX + (Math.sin(this.horizontalRotate + 1.570796327)) * movingZ);
      // let deltaZ = -delta * this.speed * (this.running + 1) * (Math.cos(this.horizontalRotate) * movingX + (Math.cos(this.horizontalRotate + 1.570796327)) * movingZ);
      //

      // console.log(this.userActions)
      // vec3.scaleAndAdd(velocity.linear, velocity.linear, transform.rotation, delta*0.01);
      // vec3.transformQuat(velocity.linear, velocity.linear, quat.rotateX(quat.create(), quat.create(), transform.rotation.x));
      // console.log( quat.rotateX(quat.create(), quat.create(), transform.rotation.x))

      const angle = getAngle(movingX, movingZ);
      const rotation = quat.rotateY(quat.create(), transform.rotation, (angle * Math.PI) / 180);

      if (userControls.movingForward || userControls.movingBackward || userControls.movingLeft || userControls.movingRight) {
        const v = vec3.fromValues(1, 0, 0);
        vec3.transformQuat(v, v, rotation);

        const v2 = vec3.fromValues(0, 1, 0);
        vec3.transformQuat(v2, v2, rotation);

        const v3 = vec3.fromValues(0, 0, 1);
        vec3.transformQuat(v3, v3, rotation);

        // console.log(v)
        // this.vector = [-v2[2], -v[2], -v3[2]];
        vec3.add(velocity.linear, velocity.linear, [-v[2], -v2[2], -v3[2]]);

        vec3.scale(velocity.linear, velocity.linear, 0.01);
        // console.log(transform.translation)
        result.push([id, velocity]);
      } else {
        vec3.set(velocity.linear, 0, 0, 0);
      }

      this.moveEvents.clear();
      this.jumpEvents.clear();

      return [[id, userControls]];
    }
  }

  return UserControlSystem;
};
