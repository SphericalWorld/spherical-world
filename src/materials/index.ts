import type TextureLibrary from '../engine/Texture/TextureLibrary';
import type { ShaderLibrary } from '../engine/ShaderLibrary';

import blockPickerProvider from './BlockPicker';
import blockRemoverProvider from './BlockRemover';
import skyboxProvider from './Skybox';

import terrainDiffuseProvider from './TerrainDiffuse';
import terrainOverlayProvider from './TerrainOverlay';
import terrainAnimatedProvider from './TerrainAnimated';
import terrainProvider from './Terrain';
import blocksDropableProvider from './BlocksDroppable';


const materialsProvider = (textureLibrary: TextureLibrary, shaderLibrary: ShaderLibrary) => {
  const terrainDiffuse = terrainDiffuseProvider(textureLibrary, shaderLibrary);
  const terrainOverlay = terrainOverlayProvider(textureLibrary, shaderLibrary);
  const terrainAnimated = terrainAnimatedProvider(textureLibrary, shaderLibrary);
  const blocksDropable = blocksDropableProvider(textureLibrary, shaderLibrary);
  const terrain = terrainProvider(textureLibrary, shaderLibrary, [
    terrainDiffuse,
    terrainOverlay,
    terrainAnimated,
  ]);

  return ([
    blockPickerProvider(textureLibrary, shaderLibrary),
    blockRemoverProvider(textureLibrary, shaderLibrary),
    skyboxProvider(textureLibrary, shaderLibrary),
    terrainDiffuse,
    terrainOverlay,
    terrainAnimated,
    terrain,
    blocksDropable,
  ]);
};

export default materialsProvider;
