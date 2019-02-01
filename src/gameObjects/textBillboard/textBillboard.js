// @flow strict
import { World, type Entity } from '../../../common/ecs';
import { Joint, Transform, Visual } from '../../components';
import GlObject from '../../engine/glObject';

export const textBillboardProvider = (ecs: World, materialLibrary: MaterialLibrary) =>
  (parentEntity: Entity) => {
    const model = createCube(1.001, false, false, [0.5, 0.5, 0.5]);
    const material = materialLibrary.get('blockRemover');
    const object = new GlObject({ model, material });
    ecs.createEntity(
      null,
      new Joint(parentEntity),
      new Transform(),
      new Visual(object),
    );
  };
