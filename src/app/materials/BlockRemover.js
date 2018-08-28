// @flow
import type { ShaderLibrary } from '../engine/ShaderLibrary';
import Material, { BLENDING_ADDITIVE } from '../engine/Material';
import TextureLibrary from '../engine/TextureLibrary';

const blockRemoverProvider = (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) => () =>
  new Material({
    name: 'blockRemover',
    diffuse: textureLibrary.get('blockDamaged'),
    blendingMode: BLENDING_ADDITIVE,
    shader: shaderLibrary.get('diffuseAnimated'),
  });

export default blockRemoverProvider;
