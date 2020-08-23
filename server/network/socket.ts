import WebSocket, { Server as WebSocketServer } from 'ws';
import type { Network } from '../components/index';
import type { Entity } from '../../common/ecs/Entity';
import type { ServerToClientMessages } from '../../common/protocol';

export type Socket = {
  player: Readonly<{ network: Network; id: Entity }>;
  ws: WebSocket;
  wss: WebSocketServer;
};

const isSocketOpen = (ws: WebSocket): boolean => ws.readyState === WebSocket.OPEN;

export const send = (receiver: Socket, payload: ServerToClientMessages): void =>
  isSocketOpen(receiver.ws)
    ? receiver.ws.send(JSON.stringify(payload))
    : console.warn('attempt to send message to closed socket');

export const broadcast = (receivers: Socket[], payload: ServerToClientMessages): void =>
  receivers.forEach((socket) => send(socket, payload));

export const broadcastToLinked = (
  player: Readonly<{ network: Network }>,
  type: string,
  payload: ServerToClientMessages,
): void => player.network.linkedPlayers.forEach(({ network: { socket } }) => send(socket, payload));
