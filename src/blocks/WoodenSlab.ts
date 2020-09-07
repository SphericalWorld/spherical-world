import { vec3 } from 'gl-matrix';
import type { BlockData } from './Block';
import Block from './Block';
import { PLANKS_OAK } from '../engine/Texture/textureConstants';
import { woodenSlab } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { slab } from './Slab';
import { createAABB } from '../physicsThread/physics/colliders/AABB';

const model = new Cube({
  ...slab,
  textures: {
    top: PLANKS_OAK,
    bottom: PLANKS_OAK,
    north: PLANKS_OAK,
    south: PLANKS_OAK,
    west: PLANKS_OAK,
    east: PLANKS_OAK,
  },
});

const WoodenSlab = (): BlockData =>
  Block(woodenSlab, {
    model,
    collisionBox: createAABB(vec3.create(), vec3.fromValues(1, 0.5, 1)),
  });

export default WoodenSlab;
