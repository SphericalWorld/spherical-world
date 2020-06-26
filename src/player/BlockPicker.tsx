import type { Entity } from '../../common/ecs';
import GlObject from '../engine/glObject';
import { React, GameObject } from '../../common/ecs';
import { createCube } from '../engine/Model';
import {
  Transform, Player, Raytracer, Visual,
} from '../components/react';
import { BlockRemover } from './BlockRemover';
import { materialLibrary } from '../engine';

type Props = Readonly<{
  id: Entity;
  parent: Entity;
}>;

export const BlockPicker = ({ id, parent }: Props) => {
  const model = createCube(1.001, false, false, [0.5, 0.5, 0.5]);
  const material = materialLibrary.get('blockSelector');
  const object = new GlObject({ model, material });
// 
  return (
    <GameObject id={id}>
      <Transform parent={parent} />
      <Visual object={object} />
      <Raytracer />
      <Player />
      <BlockRemover parent={id} />
    </GameObject>
  );
};
