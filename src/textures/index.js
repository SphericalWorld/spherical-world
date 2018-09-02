// @flow
import Texture from '../app/engine/Texture/Texture';

import grass from './blocks/grass_top.png';
import sand from './blocks/sand.png';
import stone from './blocks/stone.png';
import oak from './blocks/log_oak.png';
import oakLeaves from './blocks/leaves_oak.png';
import grassSide from './blocks/grass_side.png';
import grassSideOverlay from './blocks/grass_side_overlay.png';
import dirt from './blocks/dirt.png';
import oakTop from './blocks/log_oak_top.png';
import torch from './blocks/torch_on.png';
import tallgrass from './blocks/tallgrass.png';
import flowerYellow from './blocks/flower_dandelion.png';
import flowerRed from './blocks/flower_rose.png';
import coalOre from './blocks/coal_ore.png';
import ironOre from './blocks/iron_ore.png';
import diamondOre from './blocks/diamond_ore.png';
import goldOre from './blocks/gold_ore.png';
import cobblestone from './blocks/cobblestone.png';
import saplingOak from './blocks/sapling_oak.png';
import clay from './blocks/clay.png';
import reeds from './blocks/reeds.png';
import deadBush from './blocks/deadbush.png';
import waterStill from './blocks/water_still.png';


import blockSelector from './block_selector.png';
import blockDamage from './block_damage.png';

import foliageColorMap from './colormap/foliage.png';
import grassColorMap from './colormap/grass.png';

import skybox from './skybox.png';

const texturesProvider = async () => Promise.all([
  Texture.create(grass, { name: 'grass', atlasId: 0, meta: { overlay: true } }),
  Texture.create(sand, { name: 'sand', atlasId: 1 }),
  Texture.create(stone, { name: 'stone', atlasId: 2 }),
  Texture.create(oak, { name: 'oak', atlasId: 3 }),
  Texture.create(oakLeaves, { name: 'oakLeaves', atlasId: 4, meta: { overlay: true } }),
  Texture.create(grassSide, { name: 'grassSide', atlasId: 5 }),
  Texture.create(grassSideOverlay, { name: 'grassSideOverlay', atlasId: 5, meta: { overlay: true } }),
  Texture.create(dirt, { name: 'dirt', atlasId: 6 }),
  Texture.create(oakTop, { name: 'oakTop', atlasId: 7 }),
  Texture.create(torch, { name: 'torch', atlasId: 8 }),
  Texture.create(tallgrass, { name: 'tallgrass', atlasId: 9, meta: { overlay: true } }),
  Texture.create(flowerYellow, { name: 'flowerYellow', atlasId: 10 }),
  Texture.create(flowerRed, { name: 'flowerRed', atlasId: 11 }),
  Texture.create(coalOre, { name: 'coalOre', atlasId: 12 }),
  Texture.create(ironOre, { name: 'ironOre', atlasId: 13 }),
  Texture.create(diamondOre, { name: 'diamondOre', atlasId: 14 }),
  Texture.create(goldOre, { name: 'goldOre', atlasId: 15 }),
  Texture.create(cobblestone, { name: 'cobblestone', atlasId: 16 }),
  Texture.create(saplingOak, { name: 'saplingOak', atlasId: 17 }),
  Texture.create(clay, { name: 'clay', atlasId: 18 }),
  Texture.create(reeds, { name: 'reeds', atlasId: 19 }),
  Texture.create(deadBush, { name: 'deadBush', atlasId: 20 }),
  Texture.create(waterStill, { name: 'waterStill', atlasId: 21 }),

  //
  // waterStill: {
  //   path: 'blocks/water_still.png',
  //   image: import('../../textures/blocks/water_still.png'),
  //   animation: {
  //     atlas: true,
  //     frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63],
  //   },
  // },
  // Texture.create(terrainOverlay, { name: 'terrainOverlay' }),
  Texture.create(blockSelector, { name: 'blockSelector' }),
  Texture.create(blockDamage, { name: 'blockDamaged', animated: true }),
  Texture.create(foliageColorMap, { name: 'foliageColorMap' }),
  Texture.create(grassColorMap, { name: 'grassColorMap' }),
  Texture.create(skybox, { name: 'skybox' }),

  // Texture.create(player, { player: 'grass' }),
  // terrain: {},
  // terrainAnimated: {}
]);

export default texturesProvider;
