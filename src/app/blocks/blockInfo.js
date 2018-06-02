// @flow
import { createArray } from '../util/array';

import Air from './Air';
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
  new Air(),
  new Grass(),
  new Sand(),
  new Stone(),
  new Oak(),
  new OakLeaves(),
  new Dirt(),
  new Clay(),
  new CoalOre(),
  new IronOre(),
  new Water(),
  new Torch(),
  new TallGrass(),
  new FlowerYellow(),
  new FlowerRed(),
  new DeadBush(),
  new Reeds(),
  new Cobblestone(),
];

const blocksTextureInfo = createArray(256, () => (new Uint8Array(6)));
const blocksFlags = createArray(256, () => (new Uint8Array(5)));
const bufferInfo = createArray(256, () => createArray(6, 0));
const blocksInfo = createArray(256, () => createArray(3, 0));

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
  blocksFlags[block.id][HAS_GRAPHICS_MODEL] = block.model ? 1 : 0;
  blocksFlags[block.id][4] = block.selfTransparent ? 1 : 0;


  blocksInfo[block.id] = [block.fallSpeedCap, block.fallAcceleration, block]; // TODO remove block from array of number

  blocksTextureInfo[block.id][0] = block.textures.top | 0;
  blocksTextureInfo[block.id][1] = block.textures.bottom | 0;
  blocksTextureInfo[block.id][2] = block.textures.north | 0;
  blocksTextureInfo[block.id][3] = block.textures.south | 0;
  blocksTextureInfo[block.id][4] = block.textures.west | 0;
  blocksTextureInfo[block.id][5] = block.textures.east | 0;

  bufferInfo[block.id][0] = block.buffer.top | 0;
  bufferInfo[block.id][1] = block.buffer.bottom | 0;
  bufferInfo[block.id][2] = block.buffer.north | 0;
  bufferInfo[block.id][3] = block.buffer.south | 0;
  bufferInfo[block.id][4] = block.buffer.west | 0;
  bufferInfo[block.id][5] = block.buffer.east | 0;
}

export {
  blocksTextureInfo,
  blocksFlags,
  bufferInfo,
  blocksInfo,
};
