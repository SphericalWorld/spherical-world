// @flow
import Material from '../engine/Material';
import type TextureLibrary from '../engine/TextureLibrary';

const skyboxProvider = (textureLibrary: TextureLibrary, shaderLibrary) =>
  new Material({
    name: 'terrain',
    shader: shaderLibrary.get('chunk'),
    diffuse: textureLibrary.get('blockDamaged'),
  });

export default skyboxProvider;
