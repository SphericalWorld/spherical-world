// @flow strict
import type { Entity } from '../../common/ecs/Entity';
import type { MaterialLibrary } from '../engine/Material/MaterialLibrary';
import BlockRemover from '../components/BlockRemover';
import GlObject from '../engine/glObject';
import { World } from '../../common/ecs';
import { Transform, Visual, Joint } from '../components';
import { createCube } from '../engine/Model';

const blockRemoverProvider = (
  ecs: World,
  materialLibrary: MaterialLibrary,
) => (pickerId: Entity, id: ?Entity) => {
  const model = createCube(1.001, false, false, [0.5, 0.5, 0.5]);
  const material = materialLibrary.get('blockRemover');
  const object = new GlObject({ model, material });
  return (ecs.createEntity(
    id,
    new Transform(0, 64, 0),
    new Visual(object),
    new BlockRemover(),
    new Joint(pickerId),
  ));
};

export type CreateBlockRemover = $Call<typeof blockRemoverProvider, *, *>;

export default blockRemoverProvider;
