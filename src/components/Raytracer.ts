import type { vec3, vec2 } from 'gl-matrix';
import type { BlockFace, Block } from '../../common/blocks';
import { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export type BlockDetails = {
  block: Block;
  position: vec3;
  coordinates: vec2;
  positionInChunk: vec3;
};

/**
 * Component to change position of Entity by moving it to 3D world cursor position
 */
export class Raytracer extends Component<{}> {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'raytracer' = 'raytracer';

  face: BlockFace = Component.memoryManager.getUint8();
  hasEmptyBlock = Component.memoryManager.getUint8();
  block: BlockDetails;
  emptyBlock: BlockDetails;

  constructor() {
    super();
    this.block = {
      block: Component.memoryManager.getUint16(),
      coordinates: Component.memoryManager.getVec2(),
      position: Component.memoryManager.getVec3(),
      positionInChunk: Component.memoryManager.getVec3(),
    };
    this.emptyBlock = {
      block: Component.memoryManager.getUint16(),
      coordinates: Component.memoryManager.getVec2(),
      position: Component.memoryManager.getVec3(),
      positionInChunk: Component.memoryManager.getVec3(),
    };
    this.face = 0;
  }
}
