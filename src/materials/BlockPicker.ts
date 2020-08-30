import { SimpleMaterial, BLENDING_TRANSPARENT } from '../engine/Material/SimpleMaterial';
import type TextureLibrary from '../engine/Texture/TextureLibrary';
import type { ShaderLibrary } from '../engine/ShaderLibrary';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary): SimpleMaterial =>
  new SimpleMaterial({
    name: 'blockSelector',
    diffuse: textureLibrary.get('blockSelector'),
    blendingMode: BLENDING_TRANSPARENT,
    shader: shaderLibrary.get('diffuse'),
  });
