import type { vec3 } from 'gl-matrix';
import type { Entity } from '../../../common/ecs';
import { GameObject, React } from '../../../common/ecs';
import { Joint, Visual, Transform } from '../../components';
import { createBillboard } from '../../engine/Model';
import { GlObject } from '../../engine';
import { SimpleMaterial, BLENDING_TRANSPARENT } from '../../engine/Material';
import { makeTextureFromText, Texture } from '../../engine/Texture';
import { billboard } from '../../shaders/Billboard';

type Props = Readonly<{
  parent: Entity;
  position: vec3;
  text: string;
}>;

const model = createBillboard();

const getMaterial = (diffuse: Texture) =>
  new SimpleMaterial({
    shader: billboard,
    diffuse,
    blendingMode: BLENDING_TRANSPARENT,
  });

export const TextBillboard = ({ parent, position, text }: Props): JSX.Element => {
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
