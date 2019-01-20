// @flow strict
import { inflate } from 'pako';
import EventObservable from '../common/GameEvent/EventObservable';

type NetworkEvent = {
  +type: string;
  +payload: {
    +data: Object;
    +binaryData: ?Uint8Array;
  };
}

class Network {
  latency: number = 0;
  connection: WebSocket;
  connected = false;
  pingDescriptor: IntervalID;
  requestBinaryData: ?Uint8Array;
  host: string = `ws://${window.location.hostname}`;
  port: number = 8080;
  events: EventObservable<NetworkEvent> = new EventObservable();
  addonServerInfo = {
    host: window.location.origin,
  };

  /** binary data from last package. data saved in this field and wait for next package
   * with json data, which should describe purpose of this data, after that we'll be able
   * to call proper handler */
  requestBinaryData = null;

  processBinaryData(data: ArrayBuffer) {
    this.requestBinaryData = inflate(new Uint8Array(data));
  }

  processAction(message: MessageEvent) {
    this.events.emit({
      type: message.type,
      payload: {
        data: message.data,
        binaryData: this.requestBinaryData,
      },
    });
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

  emit(type: string, data?: mixed): void {
    if (!this.connected) {
      console.log('socket disconnected');
      return;
    }
    this.connection.send(JSON.stringify({ type, data }));
  }
}

export default Network;
