// @flow
import type { Entity } from '../../common/ecs/Entity';
import GlObject from '../engine/glObject';
import { World } from '../../common/ecs';
import {
  Transform, Visual, Skybox, Joint,
} from '../components';
import { createCube } from '../engine/Model';
import type { MaterialLibrary } from '../engine/Material/MaterialLibrary';

const skyboxProvider = (ecs: World, materialLibrary: MaterialLibrary) =>
  (playerId: Entity, id: Entity): Entity => {
    const model = createCube(1000, true, true);
    const material = materialLibrary.get('skybox');
    const object = new GlObject({ model, material });
    return (ecs.createEntity(
      id,
      new Transform(0, 64, 0),
      new Visual(object),
      new Skybox(),
      new Joint(playerId),
    )).id;
  };

export default skyboxProvider;
