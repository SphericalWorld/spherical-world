import type TextureLibrary from '../engine/Texture/TextureLibrary';
import type { ShaderLibrary } from '../engine/ShaderLibrary';

import blockPickerProvider from './BlockPicker';
import blockRemoverProvider from './BlockRemover';
import playerProvider from './Player';
import skyboxProvider from './Skybox';

import terrainDiffuseProvider from './TerrainDiffuse';
import terrainOverlayProvider from './TerrainOverlay';
import terrainAnimatedProvider from './TerrainAnimated';
import terrainProvider from './Terrain';
import blocksDropableProvider from './BlocksDroppable';
import type { Material } from '../engine/Material';
import flameProvider from './Flame';
import BlocksInventory from './BlocksInventory';

const materialsProvider = (
  textureLibrary: TextureLibrary,
  shaderLibrary: ShaderLibrary,
): ReadonlyArray<Material> => {
  const terrainDiffuse = terrainDiffuseProvider(textureLibrary, shaderLibrary);
  const terrainOverlay = terrainOverlayProvider(textureLibrary, shaderLibrary);
  const terrainAnimated = terrainAnimatedProvider(textureLibrary, shaderLibrary);
  const blocksDropable = blocksDropableProvider(textureLibrary, shaderLibrary);
  const flame = flameProvider(textureLibrary, shaderLibrary);

  const terrain = terrainProvider(textureLibrary, shaderLibrary, [
    terrainDiffuse,
    terrainOverlay,
    terrainAnimated,
  ]);

  return [
    blockPickerProvider(textureLibrary, shaderLibrary),
    blockRemoverProvider(textureLibrary, shaderLibrary),
    skyboxProvider(textureLibrary, shaderLibrary),
    playerProvider(textureLibrary, shaderLibrary),
    BlocksInventory(textureLibrary, shaderLibrary),
    terrainDiffuse,
    terrainOverlay,
    terrainAnimated,
    terrain,
    blocksDropable,
    flame,
  ];
};

export default materialsProvider;
