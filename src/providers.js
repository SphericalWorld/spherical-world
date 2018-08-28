// @flow
import type { ShaderLibrary } from './app/engine/ShaderLibrary';
import type Network from './app/network';
import Main from './app/main';
import playerProvider from './app/player/Player';
import GlTextureLibrary from './app/engine/TextureLibrary';
import Thread from './app/Thread/Thread';
import texturesProvider from './textures';
import shaderLibraryProvider from './app/engine/ShaderLibrary';
import materialLibraryProvider from './app/engine/MaterialLibrary';
import materialsProvider from './app/materials';
import shadersProvider from './shaders';
import inventoryProvider from './app/player/Inventory';
import blockRemoverProvider from './app/player/BlockRemover';
import blockPickerProvider from './app/player/BlockPicker';
import skyboxProvider from './app/skybox';
import chunkProvider from './app/Terrain/Chunk';
import resourceLoader from './app/ResourceLoader';
import addon from './app/addon';
import terrainBaseProvider from './app/Terrain/TerrainBase';
import terrainProvider from './app/Terrain';
import systemsProvider from './app/systems';

import timeProvider from './app/Time/Time';
import { World } from './app/ecs';

import * as componentsProvider from './app/components';

import { THREAD_PHYSICS, THREAD_CHUNK_HANDLER, THREAD_MAIN } from './app/Thread/threadConstants';

import inputProvider from './app/Input/inputProvider';
import inputSourcesProvider from './app/Input/inputSources/inputSourcesProvider';
import inputContextsProvider from './app/Input/inputContexts';

const createECS = (physicsThread: Worker, chunksHandlerThread: Worker) => {
  const world = new World(THREAD_MAIN);
  world.registerThread(new Thread(THREAD_PHYSICS, physicsThread));
  world.registerThread(new Thread(THREAD_CHUNK_HANDLER, chunksHandlerThread));
  world.registerComponentTypes(...Object.values(componentsProvider));

  const inputSources = inputSourcesProvider();
  const inputContexts = inputContextsProvider();
  const input = inputProvider(inputSources, inputContexts);
  world.setInput(input);

  return world;
};

const getTerrain = (Chunk, textureLibrary, materialLibrary, TerrainBase) => {
  const Terrain = terrainProvider(Chunk, TerrainBase);
  const terrain = new Terrain();
  terrain.texture = textureLibrary.get('terrain').glTexture;
  terrain.overlayTexture = textureLibrary.get('terrainOverlay').glTexture;
  terrain.animatedTexture = textureLibrary.get('animatedTexture').glTexture;

  terrain.generateBiomeColorMap(textureLibrary.get('foliageColorMap').glTexture);
  terrain.makeMipMappedTextureAtlas(textureLibrary.makeMipMappedTextureAtlas());
  const material = materialLibrary.get('terrain');
  terrain.material = material;
  return terrain;
};

const getShaders = (): ShaderLibrary => {
  const shaders = shadersProvider();
  return new (shaderLibraryProvider())()
    .add(...shaders);
};

const getTextures = async () => {
  const textures = await texturesProvider();
  const textureLibrary = new GlTextureLibrary();
  return textureLibrary
    .add(...textures)
    .add(textureLibrary.makeTextureAtlasOverlay())
    .add(textureLibrary.makeTextureAtlas())
    .add(textureLibrary.makeAnimatedTextureAtlas());
};

const getMaterials = (textureLibrary: GlTextureLibrary, shaderLibrary: ShaderLibrary) => {
  const materials = materialsProvider(textureLibrary, shaderLibrary);
  return [new (materialLibraryProvider())()
    .add(...Object.values(materials)), materials];
};

const mainProvider = async (store, network: Network, physicsThread: Worker, chunksHandlerThread: Worker) => {
  const textureLibrary = await getTextures();
  const shaderLibrary = getShaders();
  const [materialLibrary, materials] = getMaterials(textureLibrary, shaderLibrary);
  const world = createECS(physicsThread, chunksHandlerThread);
  const BlockRemover = blockRemoverProvider(world, materials.BlockRemover);
  const BlockPicker = blockPickerProvider(world, materialLibrary, BlockRemover);
  const Skybox = skyboxProvider(world, materialLibrary);
  const time = new (timeProvider())(Date.now());
  const Chunk = chunkProvider();
  const TerrainBase = terrainBaseProvider(Chunk);
  const terrain = getTerrain(Chunk, textureLibrary, materialLibrary, TerrainBase);
  const Addon = addon(store);
  const ResourceLoader = resourceLoader(Addon);
  const Inventory = inventoryProvider(store);
  const Player = playerProvider(world, materialLibrary, BlockPicker, Inventory);

  world.registerSystem(...systemsProvider(world, terrain, network, time, store));

  return Main(store, network, Player, ResourceLoader, world, Skybox);
};

export default mainProvider;
