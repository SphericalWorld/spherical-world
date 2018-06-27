// @flow
import Material from '../engine/Material';
import type TextureLibrary from '../engine/TextureLibrary';
import type { ShaderLibrary } from '../engine/ShaderLibrary';

const skyboxProvider = (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) =>
  new Material({
    name: 'skybox',
    shader: shaderLibrary.get('skybox'),
  });

export default skyboxProvider;
