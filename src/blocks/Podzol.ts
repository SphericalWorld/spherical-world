import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_PODZOL, TEXTURE_PODZOL_SIDE, DIRT } from '../engine/Texture/textureConstants';
import { podzol } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';
import { cube } from './Cube';

const model = new Cube({
  ...cube,
  textures: {
    top: TEXTURE_PODZOL,
    bottom: DIRT,
    north: TEXTURE_PODZOL_SIDE,
    south: TEXTURE_PODZOL_SIDE,
    west: TEXTURE_PODZOL_SIDE,
    east: TEXTURE_PODZOL_SIDE,
  },
});

const Podzol = (): BlockData =>
  Block(podzol, {
    model,
  });

export default Podzol;
