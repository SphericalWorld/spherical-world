// @flow
import type TextureLibrary from '../engine/TextureLibrary';
import type { ShaderLibrary } from '../engine/ShaderLibrary';

import blockPickerProvider from './BlockPicker';
import blockRemoverProvider from './BlockRemover';
import skyboxProvider from './Skybox';
import terrainProvider from './Terrain';


const materialsProvider = (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) => ({
  BlockPicker: blockPickerProvider(textureLibrary, shaderLibrary),
  BlockRemover: blockRemoverProvider(textureLibrary, shaderLibrary),
  Skybox: skyboxProvider(textureLibrary, shaderLibrary),
  Terrain: terrainProvider(textureLibrary, shaderLibrary),
});

// export const BlockRemover = blockRemoverProvider(textureLibrary, shaderLibrary);

export default materialsProvider;
