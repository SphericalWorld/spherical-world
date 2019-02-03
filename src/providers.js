// @flow strict
import type { ShaderLibrary } from './engine/ShaderLibrary';
import type Network from './network';
import type { Store } from './store/store';
import itemProvider from './item/Item';
import Main from './main';
import playerProvider from './player/Player';
import GlTextureLibrary from './engine/Texture/TextureLibrary';
import Thread from './Thread/Thread';
import texturesProvider from './textures';
import shaderLibraryProvider from './engine/ShaderLibrary';
import materialLibraryProvider from './engine/Material/MaterialLibrary';
import materialsProvider from './materials';
import shadersProvider from './shaders';
import blockRemoverProvider from './player/BlockRemover';
import blockPickerProvider from './player/BlockPicker';
import skyboxProvider from './skybox';
import resourceLoader from './ResourceLoader';
import addon from './addon';
import Terrain from './Terrain';
import systemsProvider from './systems';

import timeProvider from './Time/Time';
import { World } from '../common/ecs';

import * as componentsProvider from './components';

import { THREAD_PHYSICS, THREAD_CHUNK_HANDLER, THREAD_MAIN } from './Thread/threadConstants';

import inputProvider from './Input/inputProvider';
import inputSourcesProvider from './Input/inputSources/inputSourcesProvider';
import inputContextsProvider from './Input/inputContexts';
import { textBillboardProvider } from './gameObjects';

const createECS = (physicsThread: Worker, chunksHandlerThread: Worker) => {
  const world = new World(THREAD_MAIN);
  world.registerThread(new Thread(THREAD_PHYSICS, physicsThread));
  world.registerThread(new Thread(THREAD_CHUNK_HANDLER, chunksHandlerThread));
  world.registerComponentTypes(...Object.values(componentsProvider));

  return world;
};

const getTerrain = (textureLibrary, materialLibrary) => {
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

const mainProvider = async (store: Store, network: Network, physicsThread: Worker, chunksHandlerThread: Worker) => {
  const textureLibrary = await getTextures();
  const shaderLibrary = getShaders();
  const materialLibrary = getMaterials(textureLibrary, shaderLibrary);
  const world = createECS(physicsThread, chunksHandlerThread);
  const BlockRemover = blockRemoverProvider(world, materialLibrary);
  const BlockPicker = blockPickerProvider(world, materialLibrary, BlockRemover);
  const Skybox = skyboxProvider(world, materialLibrary);
  const time = new (timeProvider())(Date.now());
  const terrain = getTerrain(textureLibrary, materialLibrary);
  const Addon = addon(store);
  const ResourceLoader = resourceLoader(Addon);
  const createTextBillboard = textBillboardProvider(world, shaderLibrary, textureLibrary);
  const Player = playerProvider(world, materialLibrary, BlockPicker, createTextBillboard);
  itemProvider(world, materialLibrary);
  const inputSources = inputSourcesProvider();
  const inputContexts = inputContextsProvider();
  const input = inputProvider(inputSources, inputContexts);
  input.onDispatch(event => world.dispatch(event));
  world.registerSystem(...systemsProvider(world, terrain, network, time, input, store));

  return Main(store, network, Player, new ResourceLoader(), world, Skybox);
};

export default mainProvider;
