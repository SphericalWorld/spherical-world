import { parentPort } from 'worker_threads';
import { Terrain } from './Terrain';

if (!parentPort)
  throw new Error('Attempt to run the module not in the worker thread scope, aborting');

const terrain = new Terrain('steppe', 11);

parentPort.addListener('message', ({ type, payload, id }) => {
  if (type === 'ensureChunk') {
    terrain.generateChunk(payload.x, payload.z).then((data) => {
      parentPort?.postMessage({ id, payload: data });
    });
  }
});
