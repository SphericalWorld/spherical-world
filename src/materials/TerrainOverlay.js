// @flow strict
import Material from '../engine/Material/SimpleMaterial';
import type { ShaderLibrary } from '../engine/ShaderLibrary';
import type TextureLibrary from '../engine/Texture/TextureLibrary';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) =>
  new Material({
    name: 'terrainOverlay',
    shader: shaderLibrary.get('chunk'),
    diffuse: textureLibrary.get('terrainOverlay'),
  });
