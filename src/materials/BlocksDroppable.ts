import type { ShaderLibrary } from '../engine/ShaderLibrary';
import type TextureLibrary from '../engine/Texture/TextureLibrary';
import { SimpleMaterial } from '../engine/Material/SimpleMaterial';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) =>
  new SimpleMaterial({
    name: 'blocksDropable',
    shader: shaderLibrary.get('diffuse'),
    diffuse: textureLibrary.get('terrain'),
  });
