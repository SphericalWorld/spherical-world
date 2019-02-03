// @flow strict
import { type Vec3 } from 'gl-matrix';
import { World, type Entity } from '../../../common/ecs';
import { Joint, Transform, Visual } from '../../components';
import GlObject from '../../engine/glObject';
import { createBillboard } from '../../engine/Model';
import { type ShaderLibrary } from '../../engine';
import { SimpleMaterial, BLENDING_TRANSPARENT } from '../../engine/Material/SimpleMaterial';
import type TextureLibrary from '../../engine/Texture/TextureLibrary';

const model = createBillboard(1.001);

export const textBillboardProvider = (
  ecs: World,
  shaderLibrary: ShaderLibrary,
  textureLibrary: TextureLibrary,
) =>
  (parentEntity: Entity, position: Vec3, text: string) => {
    const diffuse = textureLibrary.makeTextureFromText(text);
    const shader = shaderLibrary.get('billboard');
    const material = new SimpleMaterial({
      shader,
      diffuse,
      blendingMode: BLENDING_TRANSPARENT,
    });
    const object = new GlObject({ model, material });
    ecs.createEntity(
      null,
      new Joint(parentEntity, position),
      new Transform(),
      new Visual(object),
    );
  };
