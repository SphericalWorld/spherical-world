import type { ShaderLibrary } from './engine/ShaderLibrary';
import type Network from './network';
import type { Store } from './store/store';
import itemProvider from './item/Item';
import Main from './main';
import playerProvider from './player/Player';
import Thread from './Thread/Thread';
import texturesProvider from './textures';
import materialsProvider from './materials';
import shadersProvider from './shaders';
import Terrain from './Terrain';
import systemsProvider from './systems';

import { Time } from './Time/Time';
import { World } from '../common/ecs';

import {
  BlockRemover,
  Camera,
  Collider,
  Gravity,
  Physics,
  Player,
  Raytracer,
  Skybox,
  Transform,
  UserControlled,
  Velocity,
  Visual,
  Joint,
  Item,
  NetworkSync,
  Inventory,
  Script,
} from './components';

import { THREAD_PHYSICS, THREAD_CHUNK_HANDLER, THREAD_MAIN } from './Thread/threadConstants';

import inputProvider from './Input/inputProvider';
import inputSourcesProvider from './Input/inputSources/inputSourcesProvider';
import inputContextsProvider from './Input/inputContexts';
import { textureLibrary, shaderLibrary, materialLibrary, GlObject } from './engine';
import { initHudAPI } from './hud/HudApi';
import type { MainThreadEvents } from './Events';
import { generateBlockModels } from './blocks/blocksInfo';

type Threads = Readonly<{
  physicsThread: Worker;
  chunksHandlerThread: Worker;
}>;

const createECS = ({ physicsThread, chunksHandlerThread }: Threads) => {
  const world = new World<MainThreadEvents>(THREAD_MAIN);
  world.registerComponentTypes(
    BlockRemover,
    Camera,
    Collider,
    Gravity,
    Physics,
    Player,
    Raytracer,
    Skybox,
    Transform,
    UserControlled,
    Velocity,
    Visual,
    Joint,
    Item,
    NetworkSync,
    Inventory,
    Script,
  );
  world.registerThread(new Thread(THREAD_PHYSICS, physicsThread));
  world.registerThread(new Thread(THREAD_CHUNK_HANDLER, chunksHandlerThread));

  return world;
};

const getTerrain = () => {
  const terrain = new Terrain();
  terrain.generateBiomeColorMap(textureLibrary.get('foliageColorMap').glTexture);
  // terrain.makeMipMappedTextureAtlas(textureLibrary.makeMipMappedTextureAtlas());
  terrain.material = materialLibrary.get('terrain');
  terrain.occlusionCullingShader = shaderLibrary.get('occlusionCulling');
  return terrain;
};

const getShaders = (): ShaderLibrary => {
  const shaders = shadersProvider();
  return shaderLibrary.add(...shaders);
};

const getTextures = async () => {
  const textures = await texturesProvider();
  return textureLibrary
    .add(...textures)
    .add(textureLibrary.makeTextureAtlasOverlay())
    .add(textureLibrary.makeTextureAtlas())
    .add(textureLibrary.makeAnimatedTextureAtlas());
};

const getMaterials = () => {
  const materials = materialsProvider(textureLibrary, shaderLibrary);
  return materialLibrary.add(...materials);
};

const mainProvider = async (store: Store, network: Network, threads: Threads) => {
  await getTextures();
  getShaders();
  getMaterials();
  const world = createECS(threads);
  const time = new Time(12 * 60 * 1000);
  const terrain = getTerrain();
  playerProvider(world, terrain);
  itemProvider(world);
  const inputSources = inputSourcesProvider();
  const inputContexts = inputContextsProvider();
  const input = inputProvider(inputSources, inputContexts);
  input.onDispatch((event) => world.dispatch(event));
  world.registerSystem(...systemsProvider(world, terrain, network, time, input, store));
  initHudAPI(world);
  generateBlockModels();
  return Main(network, world);
};

export default mainProvider;
