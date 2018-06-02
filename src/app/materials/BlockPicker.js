// @flow
import Material, { BLENDING_TRANSPARENT } from '../engine/Material';
import TextureLibrary from '../engine/TextureLibrary';
import { ShaderLibrary } from '../engine/ShaderLibrary';

const blockPickerProvider = (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) =>
  new Material({
    name: 'blockSelector',
    diffuse: textureLibrary.get('blockSelector'),
    blendingMode: BLENDING_TRANSPARENT,
    shader: shaderLibrary.get('diffuse'),
  });

export default blockPickerProvider;
