declare module "ws" {
  declare class WebSocket {
    static +CONNECTING: 'CONNECTING';
    static +OPEN: 'OPEN';
    static +CLOSING: 'CLOSING';
    static +CLOSED: 'CLOSED';
    +readyState: 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

    on(message: 'message', handler: (data: string) => any): void;
    on(message: 'close', handler: () => any): void;

    send(data: any, options?: Object, cb?: Function): void;
  }

  declare export class Server {
    constructor({| +port: number |}): Server;

    on(message: 'connection', handler: (ws: WebSocket) => any): void;
  }

  declare export default typeof WebSocket;
}
