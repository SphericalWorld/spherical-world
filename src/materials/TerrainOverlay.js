// @flow strict
import { SimpleMaterial } from '../engine/Material/SimpleMaterial';
import type { ShaderLibrary } from '../engine/ShaderLibrary';
import type TextureLibrary from '../engine/Texture/TextureLibrary';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) =>
  new SimpleMaterial({
    name: 'terrainOverlay',
    shader: shaderLibrary.get('chunk'),
    diffuse: textureLibrary.get('terrainOverlay'),
  });
