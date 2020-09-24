import { vec3 } from 'gl-matrix';
import type { Entity } from '../../common/ecs/Entity';
import type { Transform } from './Transform';
import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export type JointProps = { parent: Entity; distance?: vec3 };

/**
 * Component which bounds its entity to parent entity and move together with parent
 * @param {Entity} parent entity to which Joint will be attached
 * @param {vec3} distance position in ***parent*** coordinates, where Joint entity will be located.
 * Position of Joint will be sum of parent position and ***distance***
 */
export class Joint extends Component<JointProps> {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'joint' = 'joint';

  parent: Entity;
  parentTransform: Transform;
  distance: vec3;

  constructor({ parent, distance = vec3.create() }: { parent: Entity; distance: vec3 }) {
    super();
    this.parent = parent;
    this.distance = distance;
  }
}
