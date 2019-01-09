// @flow strict
import type { Entity } from '../../common/ecs/Entity';
import type { MaterialLibrary } from '../engine/Material/MaterialLibrary';
import type { CreateBlockRemover } from './BlockRemover';
import GlObject from '../engine/glObject';
import { World } from '../../common/ecs';
import {
  Transform, Visual, Raytracer, Player,
} from '../components';
import { createCube } from '../engine/Model';

const blockPickerProvider = (
  ecs: World,
  materialLibrary: MaterialLibrary,
  BlockRemover: CreateBlockRemover,
) => (parent: Entity): Entity => {
  const model = createCube(1.001, false, false, [0.5, 0.5, 0.5]);
  const material = materialLibrary.get('blockSelector');
  const object = new GlObject({ model, material });

  const picker = ecs.createEntity(
    null,
    new Transform(0, 64, 0, parent),
    new Visual(object),
    new Raytracer(),
    new Player(),
  );
  BlockRemover(picker.id);
  return picker.id;
};

export default blockPickerProvider;
