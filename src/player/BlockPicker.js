// @flow strict
import { vec3 } from 'gl-matrix';
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
) => (parent: Entity) => {
  const model = createCube(1.001, false, false, [0.5, 0.5, 0.5]);
  const material = materialLibrary.get('blockSelector');
  const object = new GlObject({ model, material });

  const picker = ecs.createEntity(
    null,
    new Transform(vec3.create(), parent),
    new Visual(object),
    new Raytracer(),
    new Player(),
  );
  const blockRemover = BlockRemover(picker.id, null);
  picker.children.push(blockRemover);
  return picker;
};

export type CreateBlockPicker = $Call<typeof blockPickerProvider, *, *, *>;

export default blockPickerProvider;
