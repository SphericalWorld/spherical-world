// @flow strict
import type { ShaderLibrary } from '../engine/ShaderLibrary';
import type TextureLibrary from '../engine/Texture/TextureLibrary';
import Material from '../engine/Material/SimpleMaterial';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) =>
  new Material({
    name: 'blocksDropable',
    shader: shaderLibrary.get('diffuse'),
    diffuse: textureLibrary.get('terrain'),
  });
