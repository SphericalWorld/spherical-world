const CHUNK_GENERATION_TIME = 'Chunk generation time';

export const profileChunkGeneration = (name: string = CHUNK_GENERATION_TIME): (() => void) => {
  let chunkGenerated = 0;
  return () => {
    if (chunkGenerated === 0) {
      console.time(name);
    }
    chunkGenerated += 1;
    if (chunkGenerated === 16 * 16) {
      console.timeEnd(name);
    }
  };
};
