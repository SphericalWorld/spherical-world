import type { ShaderLibrary } from '../engine/ShaderLibrary';
import type TextureLibrary from '../engine/Texture/TextureLibrary';
import { SimpleMaterial, BLENDING_TRANSPARENT } from '../engine/Material/SimpleMaterial';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary): SimpleMaterial =>
  new SimpleMaterial({
    name: 'flame',
    shader: shaderLibrary.get('diffuse'),
    blendingMode: BLENDING_TRANSPARENT,
    diffuse: textureLibrary.get('flame'),
  });
