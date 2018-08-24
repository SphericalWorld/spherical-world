// @flow
import zlib from 'pako';
import type { GameEvent } from './GameEvent/GameEvent';
import HashMap from '../../common/fp/data-structures/Map';
import EventObservable from './GameEvent/EventObservable';

class Network {
  latency: number = 0;
  router = {};
  requests: HashMap<number, {resolve: Function}> = new HashMap();
  connection: WebSocket;
  connected = false;
  pingDescriptor: IntervalID;
  requestId: number = 0;
  requestBinaryData: ?ArrayBuffer;
  host: string = `ws://${window.location.hostname}`;
  port: number = 8080;
  events: EventObservable<GameEvent> = new EventObservable();

  constructor() {
    this.addonServerInfo = {
      host: window.location.origin,
    };

    /** binary data from last package. data saved in this field and wait for next package
     * with json data, which should describe purpose of this data, after that we'll be able
     * to call proper handler */
    this.requestBinaryData = null;
  }

  processBinaryData(data: ArrayBuffer) {
    this.requestBinaryData = zlib.inflate(new Uint8Array(data));
  }

  processResponseToRequest(message: MessageEvent) {
    this.requests.get(message.id)
      .map((request) => {
        const { resolve, reject } = request;
        if (this.requestBinaryData) {
          resolve([message.data, this.requestBinaryData]);
          this.requestBinaryData = null;
        } else {
          resolve(message.data);
        }
        return this.requests.delete(message.id);
      });
  }

  processAction(message: MessageEvent) {
    this.events.emit({
      type: message.type,
      payload: {
        data: message.data,
        binaryData: this.requestBinaryData,
      },
    });
    if (this.router[message.type]) {
      if (typeof message.id === 'number') {
        const callback = function (result) {
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

  async connect(): Promise<void> {
    this.connection = new WebSocket(`${this.host}:${this.port}`);
    await new Promise((resolve, reject) => {
      this.connection.binaryType = 'arraybuffer';
      this.connection.onopen = resolve;
      this.connection.onclose = () => { this.connected = false; };

      this.connection.onmessage = (message: MessageEvent) => {
        if (message.data instanceof ArrayBuffer) {
          this.processBinaryData(message.data);
          return;
        }
        const parsedMessage = JSON.parse(message.data);
        if (typeof parsedMessage.id === 'number') {
          this.processResponseToRequest(parsedMessage);
          return;
        }
        this.processAction(parsedMessage);
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

  route(message: string, handler: Function) {
    this.router[message] = handler;
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
      console.log('socket disconnected');
      return;
    }
    this.connection.send(JSON.stringify({ type, data }));
  }
}

export default Network;
