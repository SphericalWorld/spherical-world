import { baseBlock, BlockInfo } from '../block';
import { air } from './Air';
import { clay } from './Clay';
import { coalOre } from './CoalOre';
import { cobblestone } from './Cobblestone';
import { cobblestoneMossy } from './CobblestoneMossy';
import { deadBush } from './DeadBush';
import { dirt } from './Dirt';
import { flowerRed } from './FlowerRed';
import { flowerYellow } from './FlowerYellow';
import { grass } from './Grass';
import { gravel } from './Gravel';
import { ironOre } from './IronOre';
import { mushroomBrown } from './MushroomBrown';
import { mushroomRed } from './MushroomRed';
import { oak } from './Oak';
import { oakLeaves } from './OakLeaves';
import { planks } from './Planks';
import { podzol } from './Podzol';
import { reeds } from './Reeds';
import { sand } from './Sand';
import { stone } from './Stone';
import { stoneBrick } from './StoneBrick';
import { tallGrass } from './TallGrass';
import { torch } from './Torch';
import { water } from './Water';
import { wood } from './Wood';
import { woodenSlab } from './WoodenSlab';

const blocks = [
  air,
  clay,
  coalOre,
  cobblestone,
  cobblestoneMossy,
  deadBush,
  dirt,
  flowerRed,
  flowerYellow,
  grass,
  gravel,
  ironOre,
  mushroomBrown,
  mushroomRed,
  oak,
  oakLeaves,
  planks,
  podzol,
  reeds,
  sand,
  stone,
  stoneBrick,
  tallGrass,
  torch,
  water,
  wood,
  woodenSlab,
];

const blocksInfo = new Array<BlockInfo>(256).fill(baseBlock);

for (const block of blocks) {
  blocksInfo[block.id] = block;
}

export {
  blocksInfo,
  air,
  clay,
  coalOre,
  cobblestone,
  cobblestoneMossy,
  deadBush,
  dirt,
  flowerRed,
  flowerYellow,
  grass,
  gravel,
  ironOre,
  mushroomBrown,
  mushroomRed,
  oak,
  oakLeaves,
  planks,
  podzol,
  reeds,
  sand,
  stone,
  stoneBrick,
  tallGrass,
  torch,
  water,
  wood,
  woodenSlab,
};
