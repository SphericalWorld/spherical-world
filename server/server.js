// @flow
const Terrain = require('./terrain/Terrain');
const StaticLoader = require('./staticLoader');
const WebSocketServer = require('ws').Server;
const WebSocket = require('ws');
const Player = require('./player');
const SocketHandlers = require('./socketHandlers');

function socketPostMessage(message, data, callback) {
  if (this.readyState === WebSocket.OPEN) {
    let params = {
      type: message,
      data,
    };
    if (typeof callback === 'function') {
      params.id = this.requestId;
      this.requests.push({ id: this.requestId, callback, time: Date.now() });
      this.requestId++;
    } else if (typeof data === 'function') {
      params = {
        type: message,
        id: this.requestId,
      };
      this.requests.push({ id: this.requestId, callback: data, time: Date.now() });
      this.requestId++;
    }
    this.send(JSON.stringify(params));
  } else {
    console.warn('sttemt to send message to closed socket');
  }
}

export default class Server {
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
    this.staticLoader = new StaticLoader(1337);
    this.router.terrain = this.terrain;
    this.router.route('loadGameData', this.router.loadGameData.bind(this.router));
    this.router.route('PING', this.router.ping.bind(this.router));
    this.router.route('TERRAIN_PLACED_BLOCK', this.router.putBlock.bind(this.router));
    this.router.route('TERRAIN_REMOVED_BLOCK', this.router.removeBlock.bind(this.router));
    this.router.route('PLAYER_CHANGE_POSITION', this.router.playerChangePosition.bind(this.router));
    this.router.route('PLAYER_CHANGED_ROTATION', this.router.playerChangeRotation.bind(this.router));
    this.router.route('PLAYER_STARTED_REMOVE_BLOCK', Player.startRemoveBlock);
    this.router.route('PLAYER_STOPED_REMOVE_BLOCK', Player.stopRemoveBlock);
    this.router.route('LOGIN', this.router.login.bind(this.router));


    this.wss = new WebSocketServer({ port: 8080 });

    this.wss.on('connection', (ws) => {
      ws.requests = [];
      ws.requestId = 0;
      ws.postMessage = socketPostMessage;

      ws.on('message', (message) => {
        try {
          message = JSON.parse(message);
        } catch (e) {
          return;
        }
        if (typeof message.id === 'number' && typeof message.type === 'undefined') {
          for (let i = 0; i < ws.requests.length; i++) {
            if (ws.requests[i].id === message.id) {
              ws.requests[i].callback(message.data);
              ws.requests.splice(i, 1);
              break;
            }
          }
        } else if (typeof message.type === 'string') {
          if (this.router.router[message.type]) {
            if (typeof message.id === 'number') {
              const callback = (result, data) => {
                if (ws) { // socked  could close to that moment
                  ws.send(JSON.stringify({ id: message.id, result, data }));
                }
              };
              this.router.router[message.type](ws, message.data || callback, callback);
            } else {
              this.router.router[message.type](ws, message.data);
            }
          } else {
            console.error('handler not registered', message.type);
          }
        } else {
          console.error('unknown message format');
        }
      });

      ws.on('close', () => {
        console.log('Player disconnected');
        if (ws.player) {
          this.players.splice(this.players.indexOf(ws.player), 1);
          ws.player.destroy();
        }
      });
    });
  }
}
