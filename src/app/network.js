// @flow
import zlib from 'pako';

class Network {
  latency: number = 0;
  router = {};
  requests: Map<number, {resolve: Function}> = new Map();
  connection: WebSocket;
  connected = false;
  pingDescriptor: number;
  requestId: number = 0;
  requestBinaryData: ?ArrayBuffer;
  host: string = `ws://${window.location.hostname}`;
  port: number = 8080;

  constructor() {
    this.addonServerInfo = {
      host: window.location.origin,
    };

    /** binary data from last package. data saved in this field and wait for next package
     * with json data, which should describe purpose of this data, after that we'll be able
     * to call proper handler */
    this.requestBinaryData = null;
  }

  async connect(): Promise<void> {
    this.connection = new WebSocket(`${this.host}:${this.port}`);
    await new Promise((resolve, reject) => {
      this.connection.binaryType = 'arraybuffer';
      this.connection.onopen = resolve;
      this.connection.onclose = () => { this.connected = false; };

      this.connection.onmessage = (message: MessageEvent) => {
        if (message.data instanceof ArrayBuffer) {
          this.requestBinaryData = zlib.inflate(new Uint8Array(message.data));
        } else {
          message = JSON.parse(message.data);
          if (typeof message.id === 'number' && typeof message.type === 'undefined') {
            const request = this.requests.get(message.id);
            if (!request) {
              return console.warn(`Not found callback handler for request id=${message.id}`);
            }
            const { resolve, reject } = request;
            if (this.requestBinaryData) {
              resolve([message.data, this.requestBinaryData]);
              this.requestBinaryData = null;
            } else {
              resolve(message.data);
            }
            this.requests.delete(message.id);
          } else {
            if (this.router[message.type]) {
              if (typeof (message.id) === 'number') {
                const callback = function(result) {
                  if (this.connected) {
                    this.connection.send(JSON.stringify({ id: message.id, data: result }));
                  }
                };
                this.router[message.type](message.data || callback, this.requestBinaryData || callback, callback);
              } else {
                this.router[message.type](message.data, this.requestBinaryData);
              }
            } else {
              console.error('no handler regitered for message', message.type);
            }
            this.requestBinaryData = null;
          }
        }
      };
    });
    this.connected = true;
  }

  async start(): Promise<void> {
    await this.request('loadGameData');
    this.pingDescriptor = setInterval(() => {
      let timeOld = Date.now();
      this.request('PING', () => {
        const timeNew = Date.now();
        this.latency = timeNew - timeOld;
        timeOld = timeNew;
      });
    }, 5000);
  }

  route(message, handler) {
    if (typeof handler === 'function') {
      this.router[message] = handler;
    }
  }

  async request(type: string, data?: any): Promise<any> {
    if (!this.connected) {
      return console.log('socket disconnected');
    }
    const params = {
      type,
      data,
      id: this.requestId,
    };
    let resolve;
    let reject;
    const promise = new Promise((onResolve, onReject) => {
      resolve = onResolve;
      reject = onReject;
    });
    this.requests.set(this.requestId, { resolve, reject, time: Date.now() });
    this.requestId += 1;
    this.connection.send(JSON.stringify(params));
    return promise;
  }

  emit(type: string, data?: any): void {
    if (!this.connected) {
      return console.log('socket disconnected');
    }
    this.connection.send(JSON.stringify({ type, data }));
  }
}

export default Network;
