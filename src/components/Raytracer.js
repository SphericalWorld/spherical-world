// @flow strict
import type { Vec3 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import type { BlockFace, Block } from '../../common/block';
import type { Component } from '../../common/ecs/Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export type BlockDetails = {|
  block: Block;
  position: Vec3;
  geoId: string;
  positionInChunk: Vec3;
|};

export default class Raytracer implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'raytracer';
  static componentType: {| 'raytracer': Raytracer |};

  face: BlockFace = 0;
  block: BlockDetails = {
    block: 0,
    position: vec3.create(),
    geoId: '',
    positionInChunk: vec3.create(),
  };

  emptyBlock: ?BlockDetails;
}
