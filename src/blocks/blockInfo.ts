import { createArray } from '../../common/utils/array';

import Air from './Air';
import type { BlockData } from './Block';
import Block from './Block';
import Clay from './Clay';
import CoalOre from './CoalOre';
import Cobblestone from './Cobblestone';
import DeadBush from './DeadBush';
import Dirt from './Dirt';
import FlowerRed from './FlowerRed';
import FlowerYellow from './FlowerYellow';
import Grass from './Grass';
import IronOre from './IronOre';
import Oak from './Oak';
import OakLeaves from './OakLeaves';
import Reeds from './Reeds';
import Sand from './Sand';
import Stone from './Stone';
import TallGrass from './TallGrass';
import Torch from './Torch';
import Water from './Water';
import Podzol from './Podzol';
import Wood from './Wood';
import MushroomBrown from './MushroomBrown';
import MushroomRed from './MushroomRed';
import Planks from './Planks';
import Gravel from './Gravel';
import CobblestoneMossy from './CobblestoneMossy';
import StoneBrick from './StoneBrick';
import WoodenSlab from './WoodenSlab';

const blocks = [
  Air(),
  Grass(),
  Sand(),
  Stone(),
  Oak(),
  OakLeaves(),
  Dirt(),
  Clay(),
  CoalOre(),
  IronOre(),
  Water(),
  Torch(),
  TallGrass(),
  FlowerYellow(),
  FlowerRed(),
  DeadBush(),
  Reeds(),
  Cobblestone(),
  Podzol(),
  Wood(),
  MushroomRed(),
  MushroomBrown(),
  Planks(),
  CobblestoneMossy(),
  Gravel(),
  StoneBrick(),
  WoodenSlab(),
];

// TODO: try typed arrays everywhere, preferable 32 bit
const blocksTextureInfo = createArray<Uint32Array>(256, () => new Uint32Array(6));
const blocksFlags = createArray<Uint32Array>(256, () => new Uint32Array(5));
const blocksInfo = createArray<BlockData>(256, Block());

export const LIGHT_TRANSPARENT: 0 = 0;
export const SIGHT_TRANSPARENT: 1 = 1;
export const HAS_PHYSICS_MODEL: 2 = 2;
export const HAS_GRAPHICS_MODEL: 3 = 3;

// [  0: block.lightTransparent,
//   1: block.sightTransparent,
//   2: block.needPhysics,
//   3: block.model.hasModel,
//   4: block.selfTransparent,
//   5: block.fallSpeedCap,
//   6: block.fallAcceleration;
//   7: block.model;

for (const block of blocks) {
  blocksFlags[block.id][LIGHT_TRANSPARENT] = block.lightTransparent ? 1 : 0;
  blocksFlags[block.id][SIGHT_TRANSPARENT] = block.sightTransparent ? 1 : 0;
  blocksFlags[block.id][HAS_PHYSICS_MODEL] = block.needPhysics ? 1 : 0;
  blocksFlags[block.id][HAS_GRAPHICS_MODEL] = 'model' in block ? 1 : 0;
  blocksFlags[block.id][4] = block.selfTransparent ? 1 : 0;

  blocksInfo[block.id] = block;

  blocksTextureInfo[block.id][0] = block.textures.top;
  blocksTextureInfo[block.id][1] = block.textures.bottom;
  blocksTextureInfo[block.id][2] = block.textures.north;
  blocksTextureInfo[block.id][3] = block.textures.south;
  blocksTextureInfo[block.id][4] = block.textures.west;
  blocksTextureInfo[block.id][5] = block.textures.east;
}

export { blocksTextureInfo, blocksFlags, blocksInfo };
