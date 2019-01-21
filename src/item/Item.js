// @flow strict
import { vec3 } from 'gl-matrix';
import type { Entity } from '../../common/ecs/Entity';
import type { MaterialLibrary } from '../engine/Material/MaterialLibrary';
import GlObject from '../engine/glObject';
import { World } from '../../common/ecs';
import {
  Transform, Visual, Collider, Physics, Velocity, Gravity, Item, Inventory,
} from '../components';
import { createCube } from '../engine/Model';
import { COLLIDER_AABB } from '../physicsThread/physics/colliders/AABB';


import {
  blocksTextureInfo,
} from '../blocks/blockInfo';

export const ITEM: 'ITEM' = 'ITEM';
const SIZE = 0.2;


const getTextureCoords = (block) => {
  const textureCoordinates = new Float32Array(48);
  for (let index = 0; index < 6; index += 1) {
    const textureU = blocksTextureInfo[block][index] / 16;
    const textureV = Math.floor(textureU) / 16;
    textureCoordinates[index * 8] = textureU;
    textureCoordinates[index * 8 + 1] = textureV;
    textureCoordinates[index * 8 + 2] = textureU;
    textureCoordinates[index * 8 + 3] = textureV + (1 / 16);
    textureCoordinates[index * 8 + 4] = textureU + (1 / 16);
    textureCoordinates[index * 8 + 5] = textureV;
    textureCoordinates[index * 8 + 6] = textureU + (1 / 16);
    textureCoordinates[index * 8 + 7] = textureV + (1 / 16);
  }
  return textureCoordinates;
};


const createItem = (
  ecs: World,
  materialLibrary: MaterialLibrary,
) => ({
  transform, id, inventory,
}: {
  transform: Transform, id: Entity, inventory: Inventory,
}): Entity => {
  const model = createCube(
    SIZE,
    undefined,
    undefined,
    undefined,
    getTextureCoords(inventory.data.items.slot.itemTypeId),
  );
  const material = materialLibrary.get('blocksDropable');
  const object = new GlObject({ model, material });
  const item = ecs.createEntity(
    id,
    Transform.deserialize(transform),
    new Visual(object),
    new Collider(
      COLLIDER_AABB,
      vec3.create(),
      vec3.fromValues(SIZE, SIZE, SIZE),
    ),
    new Physics(),
    new Velocity(),
    new Gravity(),
    new Item(),
  );
  return item.id;
};

const itemProvider = (
  ecs: World,
  materialLibrary: MaterialLibrary,
) => {
  const itemConstructor = createItem(ecs, materialLibrary);
  ecs.registerConstructor(ITEM, itemConstructor);
  return itemConstructor;
};

export default itemProvider;
