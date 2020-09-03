import type { BlockData } from './Block';
import Block from './Block';
import { TEXTURE_PODZOL, TEXTURE_PODZOL_SIDE, DIRT } from '../engine/Texture/textureConstants';
import { podzol } from '../../common/blocks/blocksInfo';
import { Cube } from '../chunksHandlerThread/Terrain/Chunk/cube';

const cube = new Cube({
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: TEXTURE_PODZOL },
    bottom: { texture: DIRT },
    north: { texture: TEXTURE_PODZOL_SIDE },
    south: { texture: TEXTURE_PODZOL_SIDE },
    west: { texture: TEXTURE_PODZOL_SIDE },
    east: { texture: TEXTURE_PODZOL_SIDE },
  },
});

const Podzol = (): BlockData =>
  Block(podzol, {
    cube,
  });

export default Podzol;
