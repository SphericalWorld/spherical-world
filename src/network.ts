import { inflate } from 'pako';
import EventObservable from '../common/GameEvent/EventObservable';

export type NetworkEvent = {
  type: string;
  payload: {
    data: unknown;
    binaryData: Uint8Array | null;
  };
};

class Network {
  latency = 0;
  connection: WebSocket;
  connected = false;
  pingDescriptor: number;
  requestBinaryData: Uint8Array | null;
  host = `ws://${window.location.hostname}`;
  port = 8080;
  events: EventObservable<NetworkEvent> = new EventObservable();
  listeners: Array<(event: NetworkEvent) => unknown> = [];

  addonServerInfo = {
    host: window.location.origin,
  };

  /** binary data from last package. data saved in this field and wait for next package
   * with json data, which should describe purpose of this data, after that we'll be able
   * to call proper handler */
  requestBinaryData = null;

  processBinaryData(data: ArrayBuffer): void {
    this.requestBinaryData = inflate(new Uint8Array(data));
  }

  processAction(message: MessageEvent): void {
    const messageToEmit = {
      type: message.type,
      payload: {
        data: message.data,
        binaryData: this.requestBinaryData,
      },
    };
    this.events.emit(messageToEmit);
    this.listeners.forEach((listener) => listener(messageToEmit));
    this.requestBinaryData = null;
  }

  async connect(): Promise<void> {
    this.connection = new WebSocket(`${this.host}:${this.port}`);
    await new Promise((resolve, reject) => {
      this.connection.binaryType = 'arraybuffer';
      this.connection.onopen = resolve;
      this.connection.onclose = () => {
        this.connected = false;
      };

      this.connection.onmessage = (message: MessageEvent) => {
        if (message.data instanceof ArrayBuffer) {
          this.processBinaryData(message.data);
          return;
        }
        if (typeof message.data === 'string') {
          const parsedMessage = JSON.parse(message.data);
          this.processAction(parsedMessage);
        }
      };
    });
    this.connected = true;
  }

  start(): void {
    this.pingDescriptor = setInterval(() => {
      let timeOld = Date.now();
      this.emit('PING', () => {
        const timeNew = Date.now();
        this.latency = timeNew - timeOld;
        timeOld = timeNew;
      });
    }, 5000);
  }

  emit(type: string, data?: unknown): void {
    if (!this.connected) {
      console.log('socket disconnected');
      return;
    }
    this.connection.send(JSON.stringify({ type, data }));
  }

  addEventListener(listener: (event: NetworkEvent) => unknown): void {
    this.listeners.push(listener);
  }

  removeEventListener(listener: (event: NetworkEvent) => unknown): void {
    this.listeners = this.listeners.filter((el) => el !== listener);
  }
}

export default Network;
