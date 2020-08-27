import type { vec3, vec2 } from 'gl-matrix';
import type { BlockFace, Block } from '../../common/blocks';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';
import type { MemoryManager } from '../../common/ecs/MemoryManager';

export type BlockDetails = {
  block: Block;
  position: vec3;
  coordinates: vec2;
  positionInChunk: vec3;
};

export default class Raytracer implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName: 'raytracer' = 'raytracer';
  static memoryManager: MemoryManager;

  face: BlockFace = Raytracer.memoryManager.getUint8();
  hasEmptyBlock = Raytracer.memoryManager.getUint8();
  block: BlockDetails;
  emptyBlock: BlockDetails;

  readonly offset: number;

  constructor({ offset }: { offset: number }) {
    this.offset = offset;
    this.block = {
      block: Raytracer.memoryManager.getUint16(),
      coordinates: Raytracer.memoryManager.getVec2(),
      position: Raytracer.memoryManager.getVec3(),
      positionInChunk: Raytracer.memoryManager.getVec3(),
    };
    this.emptyBlock = {
      block: Raytracer.memoryManager.getUint16(),
      coordinates: Raytracer.memoryManager.getVec2(),
      position: Raytracer.memoryManager.getVec3(),
      positionInChunk: Raytracer.memoryManager.getVec3(),
    };
    this.face = 0;
  }
}

/**
 * Component to change position of Entity by moving it to 3D world cursor position
 */
export const RaytracerComponent = (): JSX.Element => ({ type: Raytracer, props: {}, key: null });
