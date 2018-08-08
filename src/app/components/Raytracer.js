// @flow
import type { Vec3 } from 'gl-matrix';
import type { BlockFace } from '../../../common/block';
import { Component } from './Component';
import { THREAD_MAIN, THREAD_PHYSICS } from '../Thread/threadConstants';

export type BlockDetails = {|
  block: number;
  position: Vec3;
  geoId: string;
  positionInChunk: Vec3;
  face: BlockFace;
|};

export default class Raytracer implements Component {
  static threads = [THREAD_MAIN, THREAD_PHYSICS];
  static componentName = 'raytracer';

  block: BlockDetails = {};
  emptyBlock: ?BlockDetails;
}
