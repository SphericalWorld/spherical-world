// @flow
import { vec3 } from 'gl-matrix';
import type { Component } from '../../components/Component';
import type { Entity } from '../../ecs/Entity';
import type { System } from '../../systems/System';
import type { World } from '../../ecs';
import Transform from '../../components/Transform';
import UserControlled from '../../components/UserControlled';
import Velocity from '../../components/Velocity';

export default (ecs: World) =>
  class VelocitySystem implements System {
    components = ecs.createSelector([Transform, Velocity], [UserControlled]);
    controlledComponents = ecs.createSelector([Transform, Velocity, UserControlled]);

    update(delta: number): (Entity | Component)[][] {
      const result = [];
      for (const { id, transform, velocity } of this.components) {
        vec3.scaleAndAdd(transform.translation, transform.translation, velocity.linear, delta);
        result.push([id, transform]);
      }
      for (const {
        id, transform, velocity, userControlled,
      } of this.controlledComponents) {
        vec3.scaleAndAdd(transform.translation, transform.translation, userControlled.velocity, delta);
        vec3.scaleAndAdd(transform.translation, transform.translation, velocity.linear, delta);
        result.push([id, transform]);
      }

      return result;
    }
  };
