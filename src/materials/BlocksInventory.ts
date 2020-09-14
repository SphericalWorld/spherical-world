import type { ShaderLibrary } from '../engine/ShaderLibrary';
import type TextureLibrary from '../engine/Texture/TextureLibrary';
import { SimpleMaterial } from '../engine/Material/SimpleMaterial';

export default (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary): SimpleMaterial =>
  new SimpleMaterial({
    name: 'blocksInventory',
    shader: shaderLibrary.get('diffuseInventory'),
    diffuse: textureLibrary.get('terrain'),
  });
