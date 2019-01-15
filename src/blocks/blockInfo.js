// @flow strict
import typeof BasePropertiesComponent from './components/BasePropertiesComponent';
import { createArray } from '../../common/utils/array';

import Air from './Air';
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
];

const blocksTextureInfo = createArray<Uint8Array>(256, () => (new Uint8Array(6)));
const blocksFlags = createArray<Uint8Array>(256, () => (new Uint8Array(5)));
const bufferInfo = createArray<number[]>(256, () => createArray(6, 0));
const blocksInfo = createArray<$Call<BasePropertiesComponent, *>>(256, Block());

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

  bufferInfo[block.id][0] = block.buffer.top || 0;
  bufferInfo[block.id][1] = block.buffer.bottom || 0;
  bufferInfo[block.id][2] = block.buffer.north || 0;
  bufferInfo[block.id][3] = block.buffer.south || 0;
  bufferInfo[block.id][4] = block.buffer.west || 0;
  bufferInfo[block.id][5] = block.buffer.east || 0;
}

export {
  blocksTextureInfo,
  blocksFlags,
  bufferInfo,
  blocksInfo,
};
