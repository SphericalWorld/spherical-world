import type * as mouseRawEvents from './mouseRawEvents';
import type * as keyboardRawEvents from './keyboardRawEvents';

export type InputRawEvents =
  | typeof mouseRawEvents[keyof typeof mouseRawEvents]
  | typeof keyboardRawEvents[keyof typeof keyboardRawEvents];
