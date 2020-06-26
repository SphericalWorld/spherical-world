import type { ShaderLibrary } from '../engine/ShaderLibrary';
import {
  SimpleMaterial,
  BLENDING_ADDITIVE,
} from '../engine/Material/SimpleMaterial';
import TextureLibrary from '../engine/Texture/TextureLibrary';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) =>
  new SimpleMaterial({
    name: 'blockRemover',
    diffuse: textureLibrary.get('blockDamaged'),
    blendingMode: BLENDING_ADDITIVE,
    shader: shaderLibrary.get('diffuseAnimated'),
  });
