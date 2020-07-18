export interface Component {
  componentName: string;
  new (...params: any[]): any;
}
