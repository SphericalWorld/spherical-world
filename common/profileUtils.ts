const CHUNK_GENERATION_TIME = 'Chunk generation time';

export const profileChunkGeneration = (
  name: string = CHUNK_GENERATION_TIME,
) => {
  let chunkGenerated: number = 0;
  return <T>(chunk: T) => {
    if (chunkGenerated === 0) {
      console.time(name);
    }
    chunkGenerated += 1;
    if (chunkGenerated === 16 * 16) {
      console.timeEnd(name);
    }
    return chunk;
  };
};
