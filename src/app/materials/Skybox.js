// @flow
import Material from '../engine/Material';
import TextureLibrary from '../engine/TextureLibrary';

const skyboxProvider = (textureLibrary: TextureLibrary, shaderLibrary) =>
  new Material({
    name: 'skybox',
    shader: shaderLibrary.get('skybox'),
  });

export default skyboxProvider;
