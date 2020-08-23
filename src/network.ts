import EventObservable from '../common/GameEvent/EventObservable';
import {
  ServerToClientMessages,
  ClientToServerMessage,
  ClientToServerMessages,
} from '../common/protocol';

class Network {
  latency = 0;
  connection: WebSocket;
  connected = false;
  pingDescriptor: NodeJS.Timeout;
  /** binary data from last package. data saved in this field and wait for next package
   * with json data, which should describe purpose of this data, after that we'll be able
   * to call proper handler */
  requestBinaryData: ArrayBuffer | null = null;
  host = `ws://${window.location.hostname}`;
  port = 8080;
  events: EventObservable<ServerToClientMessages> = new EventObservable();
  listeners: Array<(event: ServerToClientMessages) => unknown> = [];

  addonServerInfo = {
    host: window.location.origin,
  };

  processBinaryData(data: ArrayBuffer): void {
    this.requestBinaryData = data;
  }

  processAction(message: ServerToClientMessages): void {
    const messageToEmit = {
      type: message.type,
      data: message.data,
      binaryData: this.requestBinaryData,
    };
    this.requestBinaryData = null;
    this.events.emit(messageToEmit);
    this.listeners.forEach((listener) => listener(messageToEmit));
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
      const timeOld = Date.now();
      this.emit({ type: ClientToServerMessage.ping });
    }, 5000);
  }

  emit(data?: ClientToServerMessages): void {
    if (!this.connected) {
      console.log('socket disconnected');
      return;
    }
    this.connection.send(JSON.stringify(data));
  }

  addEventListener(listener: (event: ServerToClientMessages) => unknown): void {
    this.listeners.push(listener);
  }

  removeEventListener(listener: (event: ServerToClientMessages) => unknown): void {
    this.listeners = this.listeners.filter((el) => el !== listener);
  }
}

export default Network;
