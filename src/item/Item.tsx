import { vec3 } from 'gl-matrix';
import type { Entity } from '../../common/ecs';
import { World, GameObject, React } from '../../common/ecs';
import type { TransformProps, InventoryProps } from '../components/react';
import {
  Transform,
  Visual,
  Collider,
  Physics,
  Velocity,
  Gravity,
  Item as ItemComponent,
} from '../components/react';
import { createCube } from '../engine/Model';
import { COLLIDER_AABB } from '../physicsThread/physics/colliders/AABB';
import { blocksTextureInfo } from '../blocks/blockInfo';
import { materialLibrary, GlObject } from '../engine';

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
    textureCoordinates[index * 8 + 3] = textureV + 1 / 16;
    textureCoordinates[index * 8 + 4] = textureU + 1 / 16;
    textureCoordinates[index * 8 + 5] = textureV;
    textureCoordinates[index * 8 + 6] = textureU + 1 / 16;
    textureCoordinates[index * 8 + 7] = textureV + 1 / 16;
  }
  return textureCoordinates;
};

type Props = Readonly<{
  id: Entity;
  transform: TransformProps;
  inventory: InventoryProps;
}>;

export const Item = ({ transform, id, inventory }: Props) => {
  const model = createCube(
    SIZE,
    undefined,
    undefined,
    undefined,
    getTextureCoords(inventory.data.items.slot.itemTypeId),
  );
  //
  const material = materialLibrary.get('blocksDropable');
  const object = new GlObject({ model, material });
  return (
    <GameObject id={id}>
      <Transform {...transform} />
      <Visual object={object} />
      <Collider type={COLLIDER_AABB} params={[vec3.create(), vec3.fromValues(SIZE, SIZE, SIZE)]} />
      <Physics />
      <Velocity />
      <Gravity />
      <ItemComponent />
    </GameObject>
  );
};

const itemProvider = (ecs: World) => {
  ecs.registerConstructor(ITEM, Item);
};

export default itemProvider;
