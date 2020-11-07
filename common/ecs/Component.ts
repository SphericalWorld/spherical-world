// export interface Component {
//   componentName: string;
//   memorySize?: number;
//   new (...params: any[]): any;

import type { MemoryManager } from './MemoryManager';

// }
class Component<T> {
  static isComponent = true;
  offset = 0;
}
class Component2<T = {}> {
  props: T;
  render: () => JSX.Element;
  context: any;
  setState: any;
  forceUpdate: any;
  state: any;
  refs: any;
  static isComponent = true;
  static memoryManager: MemoryManager;
  /// , context, setState, forceUpdate
}
const C = Component as typeof Component2;
export { C as Component };
