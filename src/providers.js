// @flow
import type { ShaderLibrary } from './app/engine/ShaderLibrary';
import type Network from './app/network';
import Main from './app/main';
import playerProvider from './app/player/Player';
import GlTextureLibrary from './app/engine/Texture/TextureLibrary';
import Thread from './app/Thread/Thread';
import texturesProvider from './textures';
import shaderLibraryProvider from './app/engine/ShaderLibrary';
import materialLibraryProvider from './app/engine/Material/MaterialLibrary';
import materialsProvider from './app/materials';
import shadersProvider from './shaders';
import inventoryProvider from './app/player/Inventory';
import blockRemoverProvider from './app/player/BlockRemover';
import blockPickerProvider from './app/player/BlockPicker';
import skyboxProvider from './app/skybox';
import Chunk from './app/Terrain/Chunk';
import resourceLoader from './app/ResourceLoader';
import addon from './app/addon';
import terrainBaseProvider from './app/Terrain/TerrainBase';
import terrainProvider from './app/Terrain';
import systemsProvider from './app/systems';

import timeProvider from './app/Time/Time';
import { World } from '../common/ecs';

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

  return world;
};

const getTerrain = (textureLibrary, materialLibrary, TerrainBase) => {
  const Terrain = terrainProvider(Chunk, TerrainBase);
  const terrain = new Terrain();
  terrain.generateBiomeColorMap(textureLibrary.get('foliageColorMap').glTexture);
  terrain.makeMipMappedTextureAtlas(textureLibrary.makeMipMappedTextureAtlas());
  terrain.material = materialLibrary.get('terrain');
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
  return new (materialLibraryProvider())()
    .add(...materials);
};

const mainProvider = async (store, network: Network, physicsThread: Worker, chunksHandlerThread: Worker) => {
  const textureLibrary = await getTextures();
  const shaderLibrary = getShaders();
  const materialLibrary = getMaterials(textureLibrary, shaderLibrary);
  const world = createECS(physicsThread, chunksHandlerThread);
  const BlockRemover = blockRemoverProvider(world, materialLibrary);
  const BlockPicker = blockPickerProvider(world, materialLibrary, BlockRemover);
  const Skybox = skyboxProvider(world, materialLibrary);
  const time = new (timeProvider())(Date.now());
  const TerrainBase = terrainBaseProvider(Chunk);
  const terrain = getTerrain(textureLibrary, materialLibrary, TerrainBase);
  const Addon = addon(store);
  const ResourceLoader = resourceLoader(Addon);
  const Inventory = inventoryProvider(store);
  const Player = playerProvider(world, materialLibrary, BlockPicker, Inventory);

  const inputSources = inputSourcesProvider();
  const inputContexts = inputContextsProvider();
  const input = inputProvider(inputSources, inputContexts);
  input.onDispatch(event => world.dispatch(event));

  world.registerSystem(...systemsProvider(world, terrain, network, time, input, store));

  return Main(store, network, Player, new ResourceLoader(), world, Skybox);
};

export default mainProvider;
