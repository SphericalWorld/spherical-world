// @flow
import type { ShaderLibrary } from './app/engine/ShaderLibrary';
import Collider from './app/components/Collider';
import { menuToggledObservable } from './app/hud/events';
import { MENU_TOGGLED } from './app/hud/hudConstants';
import Main from './app/main';
import BlockRemove from './app/systems/BlockRemove';
import socketHandlers from './app/socketHandlers';
import playerProvider from './app/player/Player';
import GlTextureLibrary from './app/engine/TextureLibrary';
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
import { drawProvider } from './app/systems';
import dayNightCycleProvider from './app/systems/DayNightCycle';
import cameraSystemProvider from './app/systems/Camera';
import hudSystemProvider from './app/systems/Hud';
import networkProvider from './app/systems/Network';

import timeProvider from './app/Time/Time';
import { World } from './app/ecs';
import Transform from './app/components/Transform';
import Raytracer from './app/components/Raytracer';
import Skybox from './app/components/Skybox';
import Visual from './app/components/Visual';
import Camera from './app/components/Camera';
import Physics from './app/components/Physics';
import Velocity from './app/components/Velocity';
import Gravity from './app/components/Gravity';
import UserControlled from './app/components/UserControlled';

import { THREAD_PHYSICS, THREAD_CHUNK_HANDLER, THREAD_MAIN } from './app/Thread/threadConstants';

import inputProvider from './app/Input/inputProvider';
import inputSourcesProvider from './app/Input/inputSources/inputSourcesProvider';
import inputContextsProvider from './app/Input/inputContexts';


import {
  cameraMovedObservable,
  cameraLockedObservable,
  cameraUnlockedObservable,
  CAMERA_MOVED,
  CAMERA_LOCKED,
  CAMERA_UNLOCKED,
} from './app/player/events';

const createECS = (physicsThread: Worker, chunksHandlerThread: Worker) => {
  const world = new World(THREAD_MAIN);
  world.registerThread(THREAD_PHYSICS, physicsThread);
  world.registerThread(THREAD_CHUNK_HANDLER, chunksHandlerThread);
  world.registerComponentTypes(
    Transform,
    Raytracer,
    Visual,
    Skybox,
    Camera,
    Physics,
    Velocity,
    Gravity,
    UserControlled,
    Collider,
  );
  physicsThread.onMessage = ({ type, payload }) => {
    if (type === 'UPDATE_COMPONENTS') {
      world.updateComponents(payload.components);
    }
  };

  world.subscribe((event) => {
    if (event.type === CAMERA_MOVED) {
      cameraMovedObservable.emit(event);
    }
    if (event.type === CAMERA_LOCKED) {
      cameraLockedObservable.emit(event);
    }
    if (event.type === CAMERA_UNLOCKED) {
      cameraUnlockedObservable.emit(event);
    }
    if (event.type === MENU_TOGGLED) {
      menuToggledObservable.emit(event);
    }
  });

  const inputSources = inputSourcesProvider();
  const inputContexts = inputContextsProvider();
  const input = inputProvider(inputSources, inputContexts);
  world.setInput(input);

  return world;
};

const getTerrain = (store, Chunk, network, textureLibrary, materialLibrary, TerrainBase) => {
  const Terrain = terrainProvider(store, Chunk, network, TerrainBase);
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
  return new (materialLibraryProvider())()
    .add(...materials);
};

const mainProvider = async (store, network, physicsThread: Worker, chunksHandlerThread: Worker) => {
  const textureLibrary = await getTextures();
  const shaderLibrary = getShaders();
  const materialLibrary = getMaterials(textureLibrary, shaderLibrary);
  const world = createECS(physicsThread, chunksHandlerThread);

  const BlockRemover = blockRemoverProvider(world, materialLibrary);
  const BlockPicker = blockPickerProvider(world, materialLibrary);
  const Skybox = skyboxProvider(world, materialLibrary);
  const time = new (timeProvider())(0);
  const DayNightCycle = dayNightCycleProvider(world, time);
  const CameraSystem = cameraSystemProvider(world);
  const HudSystem = hudSystemProvider(world, store);
  const NetworkSystem = networkProvider(world, network);
  const Chunk = chunkProvider(store);
  const TerrainBase = terrainBaseProvider(Chunk);
  const terrain = getTerrain(store, Chunk, network, textureLibrary, materialLibrary, TerrainBase);
  const Addon = addon(store);
  const ResourceLoader = resourceLoader(Addon);
  const Inventory = inventoryProvider(store);
  const Player = playerProvider(world, materialLibrary, BlockRemover, BlockPicker, Inventory);
  const SocketHandlers = socketHandlers(Player);
  const Draw = drawProvider(store, world, terrain, time);
  // const SkyboxSystem = skyboxSystemProvider(store);
  world.registerSystem(...[
    new BlockRemove(),
    new DayNightCycle(),
    new CameraSystem(),
    new Draw(),
    new HudSystem(),
    new NetworkSystem(),
  ]);

  return Main(store, network, Player, ResourceLoader, SocketHandlers, world, Skybox);
};

export default mainProvider;
