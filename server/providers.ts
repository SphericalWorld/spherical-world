import { World } from '../common/ecs/World';
import { THREAD_MAIN } from '../src/Thread/threadConstants';
import createItem from './item';
import { playerProvider } from './player';
import serverProvider from './server';
import systemsProvider from './systems';
import * as componentsProvider from './components';
import createTerrain from './terrain/Terrain';
import { createDatabase } from './database';
import { createDataStorage } from './dataStorage';
import { ChunkGeneratorThread } from './threads';

const createECS = () => {
  const world = new World(THREAD_MAIN);
  world.registerComponentTypes(...Object.values(componentsProvider));
  setInterval(() => world.update(1000 / 60), 1000 / 60);
  return world;
};

const mainProvider = async () => {
  const world = createECS();
  const createPlayer = playerProvider(world);
  const chunkGeneratorThread = new ChunkGeneratorThread();
  // const w = new Worker(path.resolve(__dirname, './threads/chunkGenerator/index.js'));
  const db = await createDatabase({
    host: 'mongo',
    port: 27017,
    authDB: 'admin',
    user: 'root',
    password: 'example',
  });
  // await db.connection.db('sphericalWorld').dropDatabase();
  const ds = createDataStorage(db);
  const Server = serverProvider(world, createTerrain(createItem(world), chunkGeneratorThread));
  const server = new Server();
  world.registerSystem(...systemsProvider(world, server, createPlayer, ds));
  return server;
};

export default mainProvider;
