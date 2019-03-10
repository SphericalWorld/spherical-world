/* eslint-disable react/jsx-filename-extension */
// @flow strict
import { type Vec3 } from 'gl-matrix';
import {
  type Entity, GameObject, React,
} from '../../../common/ecs';
import { Joint, Transform, Visual } from '../../components/react';
import { createBillboard } from '../../engine/Model';
import { GlObject } from '../../engine';
import { SimpleMaterial, BLENDING_TRANSPARENT } from '../../engine/Material';
import { makeTextureFromText } from '../../engine/Texture';
import { billboard } from '../../shaders/Billboard';

type Props = {|
  +parent: Entity,
  +position: Vec3,
  +text: string
|};

const model = createBillboard();

const getMaterial = diffuse => new SimpleMaterial({
  shader: billboard,
  diffuse,
  blendingMode: BLENDING_TRANSPARENT,
});

export const TextBillboard = ({ parent, position, text }: Props) => {
  const texture = makeTextureFromText(text);
  const material = getMaterial(texture);
  const object = new GlObject({ model, material });

  return (
    <GameObject>
      <Transform />
      <Visual object={object} />
      <Joint parent={parent} distance={position} />
    </GameObject>
  );
};
