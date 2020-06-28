import type { Material } from '../engine/Material/Material';
import type { ShaderLibrary } from '../engine/ShaderLibrary';
import type TextureLibrary from '../engine/Texture/TextureLibrary';
import MultiMaterial from '../engine/Material/MultiMaterial';

export default (
  textureLibrary: TextureLibrary,
  shaderLibrary: ShaderLibrary,
  layers: Material[],
): MultiMaterial =>
  new MultiMaterial({
    name: 'terrain',
    shader: shaderLibrary.get('chunk'),
    layers,
  });
