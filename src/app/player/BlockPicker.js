// @flow
import type { Entity } from '../../../common/ecs/Entity';
import type { MaterialLibrary } from '../engine/Material/MaterialLibrary';
import type { CreateBlockRemover } from './BlockRemover';
import GlObject from '../engine/glObject';
import { World } from '../../../common/ecs';
import {
  Transform, Visual, Raytracer, Player,
} from '../components';
import { createCube } from '../engine/Model';

const blockPickerProvider = (
  ecs: World,
  materialLibrary: MaterialLibrary,
  BlockRemover: CreateBlockRemover,
) => (id: Entity): Entity => {
  const model = createCube(1.001);
  const material = materialLibrary.get('blockSelector');
  const object = new GlObject({ model, material });

  const picker = ecs.createEntity(
    id,
    new Transform(0, 64, 0),
    new Visual(object),
    new Raytracer(),
    new Player(),
  );

  BlockRemover(picker);
  return picker;
};

export default blockPickerProvider;
