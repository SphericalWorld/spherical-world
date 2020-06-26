import type Chunk from '../Chunk';
import IO from '../../../common/fp/monads/io';

export type IGenerator = (chunk: Chunk) => IO<Chunk>;
