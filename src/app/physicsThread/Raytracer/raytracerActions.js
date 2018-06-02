// @flow
import { TRACE_FINISHED } from '../../raytracer/raytracerConstants';

export const raytracerFinish = ({
  block, blockInChunk, geoId, emptyBlock, emptyBlockInChunk, emptyBlockChunkId, plane,
}) => ({
  type: TRACE_FINISHED,
  payload: {
    block, blockInChunk, geoId, emptyBlock, emptyBlockInChunk, emptyBlockChunkId, plane,
  },
  meta: {
    worker: true,
  },
});
