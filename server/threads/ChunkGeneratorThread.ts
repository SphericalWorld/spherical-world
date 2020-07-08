// thread wrapper for the main thread
import path from 'path';
import { Worker } from 'worker_threads';
import Chunk from '../terrain/Chunk';

type Request = {
  id: number;
  resolve: Function;
  reject: Function;
};

export class ChunkGeneratorThread {
  workerThread = new Worker(path.resolve(__dirname, './chunkGenerator/index.js'));

  requestId = 0;

  requests = new Map<number, Request>();

  constructor() {
    this.workerThread.on('message', ({ id, payload }) => {
      // console.log(payload);
      const request = this.requests.get(id);
      this.requests.delete(id);
      request?.resolve(payload);
    });
  }

  request<TResult>({ type, payload }: { type: string; payload: unknown }): Promise<TResult> {
    this.workerThread.postMessage({ id: this.requestId, type, payload });
    const promiseResolver: Request = {
      id: this.requestId,
    };
    this.requests.set(this.requestId, promiseResolver);

    this.requestId += 1;
    if (this.requestId >= Number.MAX_SAFE_INTEGER) {
      this.requestId = 0;
    }
    return new Promise((resolve, reject) => {
      promiseResolver.resolve = resolve;
      promiseResolver.reject = reject;
    });
  }

  async ensureChunk(
    x: number,
    z: number,
  ): Promise<{
    dataBuffer: SharedArrayBuffer;
    flags: Buffer;
    rainfall: number[];
    temperature: number[];
  }> {
    return this.request<{
      dataBuffer: SharedArrayBuffer;
      flags: Buffer;
      rainfall: number[];
      temperature: number[];
    }>({
      type: 'ensureChunk',
      payload: { x, z },
    });
  }
}
