import { SimpleMaterial } from '../engine/Material/SimpleMaterial';
import type TextureLibrary from '../engine/Texture/TextureLibrary';
import type { ShaderLibrary } from '../engine/ShaderLibrary';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary): SimpleMaterial =>
  new SimpleMaterial({
    name: 'skybox',
    shader: shaderLibrary.get('skybox'),
    diffuse: textureLibrary.get('skybox'),
  });
