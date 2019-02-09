// @flow strict
import { React, GameObject, type Entity } from '../../common/ecs';
import {
  Transform, Visual, Skybox as SkyboxComponent, Joint,
} from '../components/react';
import { createCube } from '../engine/Model';
import { materialLibrary, GlObject } from '../engine';

type Props = {|
  +parent: Entity,
|}

export const Skybox = ({ parent }: Props) => {
  const model = createCube(1000, true, true);
  const material = materialLibrary.get('skybox');
  const object = new GlObject({ model, material });

  return (
    <GameObject>
      <Transform />
      <Visual object={object} />
      <SkyboxComponent />
      <Joint parent={parent} />
    </GameObject>
  );
};
