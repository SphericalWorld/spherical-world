import { vec3, quat } from 'gl-matrix';
import type { Entity } from '../../common/ecs';
import { Transform, Visual, Joint } from '../components/react';
import { React, GameObject } from '../../common/ecs';
import { materialLibrary, GlObject } from '../engine';
import { createModelFromSprite } from '../engine/Model/ModelFromSprite';

type Props = Readonly<{
  parent: Entity;
}>;

export const PlayerHands = ({ parent }: Props): JSX.Element => {
  const material = materialLibrary.get('flame');
  const model = createModelFromSprite(material.diffuse);
  const object = new GlObject({ model, material });

  return (
    <GameObject>
      <Transform rotation={quat.fromEuler(quat.create(), 0, 0, 90)} />
      <Visual object={object} />
      <Joint parent={parent} distance={vec3.fromValues(-0.5, -1.1, 0.6)} />
    </GameObject>
  );
};
