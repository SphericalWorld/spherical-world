// @flow
import WebSocket, { Server as WebSocketServer } from 'ws';
import HashMap from '../common/fp/data-structures/Map';
import parseJson from '../common/utils/parseString';
import Transform from '../src/app/components/Transform';
import { THREAD_MAIN } from '../src/app/Thread/threadConstants';
import Terrain from './terrain/Terrain';
import Player from './player';
import SocketHandlers from './socketHandlers';
import { World } from '../common/ecs';

const isSocketOpen = (ws: WebSocket): boolean => ws.readyState === WebSocket.OPEN;

const postMessage = ws => (message: string, data, callback) => {
  if (!isSocketOpen(ws)) {
    console.warn('attempt to send message to closed socket');
    return;
  }
  let params = {
    type: message,
    data,
  };
  if (typeof callback === 'function') {
    params.id = ws.requestId;
    ws.requests.set(ws.requestId, { callback, time: Date.now() });
    ws.requestId += 1;
  } else if (typeof data === 'function') {
    params = {
      type: message,
      id: ws.requestId,
    };
    ws.requests.set(ws.requestId, { callback: data, time: Date.now() });
    ws.requestId += 1;
  }
  ws.send(JSON.stringify(params));
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

declare class TSocketWrapper {
  player: null;
  requests: HashMap<number, { callback: Function, time: number }>;
  requestId: number;
  postMessage: Function;
  emit: Function;
  send: Function;
  sendSerialized: Function;
  static (ws: WebSocket): TSocketWrapper;
}

const SocketWrapper = ((ws: WebSocket) => ({
  player: null,
  requests: new HashMap(),
  requestId: 0,
  postMessage: postMessage(ws),
  emit: emit(ws),
  send: send(ws),
  sendSerialized: sendSerialized(ws),
}): Class<TSocketWrapper>);

type Message = {
  id: ?number;
  type: ?string;
  data: any;
}

const world = new World(THREAD_MAIN);
world.registerComponentTypes(Transform);

export default class Server {
  wss: WebSocketServer;
  connections: WeakMap<WebSocket, any> = new WeakMap();
  router: SocketHandlers = new SocketHandlers(this);
  terrain: Terrain;

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
    this.players = [];
    this.router.terrain = this.terrain;
    this.router.route('loadGameData', this.router.loadGameData.bind(this.router));
    this.router.route('PING', () => {});
    this.router.route('PLAYER_PUT_BLOCK', this.router.putBlock.bind(this.router));
    this.router.route('PLAYER_DESTROYED_BLOCK', this.router.removeBlock.bind(this.router));
    this.router.route('PLAYER_CHANGE_POSITION', this.router.playerChangePosition.bind(this.router));
    this.router.route('PLAYER_CHANGED_ROTATION', this.router.playerChangeRotation.bind(this.router));
    this.router.route('PLAYER_STARTED_REMOVE_BLOCK', Player.startRemoveBlock);
    this.router.route('PLAYER_STOPED_REMOVE_BLOCK', Player.stopRemoveBlock);
    this.router.route('LOGIN', this.router.login.bind(this.router), false);


    this.wss = new WebSocketServer({ port: 8080 });

    this.wss.on('connection', (ws) => {
      const wrapper = SocketWrapper(ws);
      this.connections.set(ws, wrapper);
      ws.on('message', data => parseJson(data)
        .map((message: Message) => {
          if (typeof message.id === 'number' && typeof message.type === 'undefined') {
            wrapper.requests.get(message.id)
              .map((request) => {
                wrapper.requests.delete(message.id);
                return request.callback(message.data);
              });
          } else if (typeof message.type === 'string') {
            if (this.router.router[message.type]) {
              if (this.router.router[message.type].needAuth && !wrapper.player) {
                return;
              }
              const callback = (result, data) => {
                if (typeof message.id === 'number' && ws) { // socked  could close to that moment
                  wrapper.send({ id: message.id, result, data });
                }
              };
              this.router.router[message.type].handler(wrapper, message.data || callback, callback);
            } else {
              console.error('handler not registered', message.type);
            }
          } else {
            console.error('unknown message format');
          }
        }));

      ws.on('close', () => {
        console.log('Player disconnected');
        const { player } = wrapper;
        if (player) {
          this.players.splice(this.players.indexOf(player), 1);
          player.destroy();
        }
      });
    });
  }
}
