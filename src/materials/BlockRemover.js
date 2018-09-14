// @flow
import type { ShaderLibrary } from '../engine/ShaderLibrary';
import Material, { BLENDING_ADDITIVE } from '../engine/Material/SimpleMaterial';
import TextureLibrary from '../engine/Texture/TextureLibrary';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) =>
  new Material({
    name: 'blockRemover',
    diffuse: textureLibrary.get('blockDamaged'),
    blendingMode: BLENDING_ADDITIVE,
    shader: shaderLibrary.get('diffuseAnimated'),
  });
