import type { ShaderLibrary } from '../engine/ShaderLibrary';
import { SimpleMaterial, BLENDING_TRANSPARENT } from '../engine/Material/SimpleMaterial';
import TextureLibrary from '../engine/Texture/TextureLibrary';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary): SimpleMaterial =>
  new SimpleMaterial({
    name: 'blockRemover',
    diffuse: textureLibrary.get('blockDamaged'),
    blendingMode: BLENDING_TRANSPARENT,
    shader: shaderLibrary.get('diffuseAnimated'),
  });
