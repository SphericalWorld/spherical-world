import { vec3 } from 'gl-matrix';
import type { BlockFace, Block } from '../../common/block';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export type BlockDetails = {
  block: Block;
  position: vec3;
  geoId: string;
  positionInChunk: vec3;
};

export default class Raytracer implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'raytracer' = 'raytracer';

  face: BlockFace = 0;
  block: BlockDetails = {
    block: 0,
    position: vec3.create(),
    geoId: '',
    positionInChunk: vec3.create(),
  };

  emptyBlock: BlockDetails | null;
}

/**
 * Component to change position of Entity by moving it to 3D world cursor position
 */
export const RaytracerComponent = (_: {}): JSX.Element => new Raytracer();
