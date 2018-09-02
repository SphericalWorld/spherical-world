// @flow
import type { Entity } from '../ecs/Entity';
import type { MaterialLibrary } from '../engine/Material/MaterialLibrary';
import BlockRemover from '../components/BlockRemover';
import GlObject from '../engine/glObject';
import { World } from '../ecs';
import { Transform, Visual, Raytracer } from '../components';
import { createCube } from '../engine/Model';

const blockRemoverProvider = (
  ecs: World,
  materialLibrary: MaterialLibrary,
) => (id: Entity): Entity => {
  const model = createCube(1.001);
  const material = materialLibrary.get('blockRemover');
  const object = new GlObject({ model, material });
  return ecs.createEntity(
    id,
    new Transform(0, 64, 0),
    new Visual(object),
    new Raytracer(),
    new BlockRemover(),
  );
};

export default blockRemoverProvider;
