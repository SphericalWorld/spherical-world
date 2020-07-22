import WebSocket, { Server as WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';
import type { World } from '../common/ecs/World';
import type { Socket } from './network/socket';
import parseJson from '../common/utils/parseString';
import type { Terrain as ITerrain } from './terrain/Terrain';
import EventObservable from '../common/GameEvent/EventObservable';
import { send } from './network/socket';

const wrapSocket = (ws: WebSocket, wss: WebSocketServer): Socket => ({
  player: null,
  ws,
  wss,
  send: (data: unknown): void => {
    ws.send(JSON.stringify(data));
  },
  sendSerialized: (data: unknown): void => {
    ws.send(data);
  },
});

type Message = {
  id: number | null;
  type: string | null;
  data: any;
};

type ServerEvents = {
  type: string;
  socket: Socket;
  payload: any;
}; // TODO: change to enum for simplified refinements

const onMessage = (events) => (socket: Socket) => (data) => {
  const message = parseJson<Message>(data);
  if (message?.type === 'CHAT_MESSAGE') {
    console.log(message);
    const dataToSend = {
      type: 'CHAT_MESSAGE',
      data: {
        id: uuid(),
        time: Date.now(),
        text: message.data,
        from: {
          id: socket.player.id,
          name: 'noName',
        },
      },
    };
    socket.wss.clients.forEach((client) => client.send(JSON.stringify(dataToSend)));
    return;
  }
  if (typeof message?.type === 'string') {
    events.emit({
      type: message.type,
      payload: message.data,
      socket,
    });
  } else {
    console.error('unknown message format');
  }
};

const serverProvider = (world: World, Terrain: ITerrain) =>
  class Server {
    wss: WebSocketServer;
    terrain: ITerrain;
    events: EventObservable<ServerEvents> = new EventObservable();

    constructor() {
      this.terrain = new Terrain('steppe', 11);
      setTimeout(() => {
        for (let i = -36; i < 36; i += 1) {
          let string = '';
          for (let j = -36; j < 36; j += 1) {
            const chunk = this.terrain.getChunk(i * 16, j * 16);
            string += chunk ? (chunk.qwe ? 2 : 1) : 0;
          }
          console.log(string);
        }
      }, 50000);
      // router.route('PING', () => {});
      // router.route('PLAYER_STARTED_REMOVE_BLOCK', Player.startRemoveBlock);
      // router.route('PLAYER_STOPED_REMOVE_BLOCK', Player.stopRemoveBlock);

      this.wss = new WebSocketServer({ port: 8080 });

      this.wss.on('connection', (ws) => {
        const wrapper = wrapSocket(ws, this.wss);
        ws.on('message', onMessage(this.events)(wrapper));

        ws.on('close', () => {
          console.log('Player disconnected');
          const { player } = wrapper;
          if (player) {
            world.deleteEntity(player.id);
          }
        });
      });
    }
  };

export type Server = InstanceType<ReturnType<typeof serverProvider>>;

export default serverProvider;
