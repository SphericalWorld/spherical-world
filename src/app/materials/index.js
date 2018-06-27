// @flow
import type TextureLibrary from '../engine/TextureLibrary';
import type { ShaderLibrary } from '../engine/ShaderLibrary';

import blockPickerProvider from './BlockPicker';
import blockRemoverProvider from './BlockRemover';
import skyboxProvider from './Skybox';
import terrainProvider from './Terrain';

const materialsProvider = (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) => [
  blockPickerProvider(textureLibrary, shaderLibrary),
  blockRemoverProvider(textureLibrary, shaderLibrary),
  skyboxProvider(textureLibrary, shaderLibrary),
  terrainProvider(textureLibrary, shaderLibrary),
];

export default materialsProvider;
