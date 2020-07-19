export interface Component {
  componentName: string;
  memorySize?: number;
  new (...params: any[]): any;
}
