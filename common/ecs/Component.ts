// export interface Component {
//   componentName: string;
//   memorySize?: number;
//   new (...params: any[]): any;

import type { THREAD_ID } from '../Thread';
import type { MemoryManager } from './MemoryManager';

// }
class Component<T = {}> {
  static isComponent = true;
  static componentName = '';
  static memorySize = 0;
  static memoryManager: MemoryManager;
  static threadsConstructors: { [key in THREAD_ID]: (obj: Component) => void };
  private offset = 0;
}

interface Component<T> {
  props: T;
  render: () => JSX.Element;
  context: any;
  setState: any;
  forceUpdate: any;
  state: any;
  refs: any;
  destructor?: () => void;
}

// class Component2<T = {}> {
//   props: T;
//   render: () => JSX.Element;
//   context: any;
//   setState: any;
//   forceUpdate: any;
//   state: any;
//   refs: any;
//   static isComponent = true;
//   static memoryManager: MemoryManager;
//   /// , context, setState, forceUpdate
// }
// const C = Component as typeof Component2;
export { Component };
