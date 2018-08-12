// @flow
import type { Entity } from '../ecs/Entity';
import GlObject from '../engine/glObject';
import { World } from '../ecs';
import { Transform, Visual, Raytracer } from '../components';
import { createCube } from '../engine/Model';
import type { MaterialLibrary } from '../engine/MaterialLibrary';

const blockPickerProvider = (
  ecs: World,
  materialLibrary: MaterialLibrary,
  BlockRemover,
) => (id: Entity): Entity => {
  const model = createCube(1.001);
  const material = materialLibrary.get('blockSelector');
  const object = new GlObject({ model, material });
  const blockRemover = BlockRemover();

  return ecs.createEntity(
    id,
    new Transform(0, 64, 0),
    new Visual(object),
    new Raytracer(),
  );
};

export default blockPickerProvider;
