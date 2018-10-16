// @flow
import WebSocket, { Server as WebSocketServer } from 'ws';
import type World from '../common/ecs/World';
import type { Socket } from './network/socket';
import parseJson from '../common/utils/parseString';
import Terrain from './terrain/Terrain';
import EventObservable from '../common/GameEvent/EventObservable';

const isSocketOpen = (ws: WebSocket): boolean => ws.readyState === WebSocket.OPEN;

const postMessage = ws => (message: string, data) => {
  if (!isSocketOpen(ws)) {
    console.warn('attempt to send message to closed socket');
    return;
  }
  ws.send(JSON.stringify({
    type: message,
    data,
  }));
};

const send = ws => (data): void => {
  ws.send(JSON.stringify(data));
};

const sendSerialized = ws => (data): void => {
  ws.send(data);
};

const emit = (ws, data): void => {
  send(ws, data);
};

const wrapSocket = ((ws: WebSocket): Socket => ({
  player: null,
  ws,
  postMessage: postMessage(ws),
  emit: emit(ws),
  send: send(ws),
  sendSerialized: sendSerialized(ws),
}));

type Message = {
  id: ?number;
  type: ?string;
  data: any;
}

type ServerEvents = {|
  type: string;
  socket: Socket;
  payload: any;
|} // TODO: change to enum for simplified refinements

const serverProvider = (world: World) => class Server {
  wss: WebSocketServer;
  connections: WeakMap<WebSocket, any> = new WeakMap();
  terrain: Terrain;
  events: EventObservable<ServerEvents> = new EventObservable();

  constructor() {
    this.terrain = new Terrain('steppe', 11);
    setTimeout(() => {
      for (let i = -36; i < 36; i += 1) {
        let string = '';
        for (let j = -36; j < 36; j += 1) {
          const chunk = this.terrain.getChunk(i * 16, j * 16);
          string += chunk ? chunk.qwe ? 2 : 1 : 0;
        }
        console.log(string);
      }
    }, 50000);
    // router.route('PING', () => {});
    // router.route('PLAYER_STARTED_REMOVE_BLOCK', Player.startRemoveBlock);
    // router.route('PLAYER_STOPED_REMOVE_BLOCK', Player.stopRemoveBlock);

    this.wss = new WebSocketServer({ port: 8080 });

    this.wss.on('connection', (ws) => {
      const wrapper = wrapSocket(ws);
      this.connections.set(ws, wrapper);
      ws.on('message', data => parseJson(data)
        .map((message: Message) => {
          if (typeof message.type === 'string') {
            this.events.emit({
              type: message.type,
              payload: message.data,
              socket: wrapper,
            });
          } else {
            console.error('unknown message format');
          }
        }));

      ws.on('close', () => {
        console.log('Player disconnected');
        const { player } = wrapper;
        if (player) {
          world.deleteEntity(player.id);
          // this.players.splice(this.players.indexOf(player), 1);
          // player.destroy();
        }
      });
    });
  }
};

declare var tmp: $Call<typeof serverProvider, *>;
export type Server = tmp;

export default serverProvider;
