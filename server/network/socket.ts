import WebSocket, { Server as WebSocketServer } from 'ws';
import type { Network, Inventory, Transform, PlayerData } from '../components/index';
import type { Entity } from '../../common/ecs/Entity';
import type { ServerToClientMessages, ServerToClientMessage } from '../../common/protocol';

export type Socket = {
  player: Readonly<{
    network: Network;
    id: Entity;
    inventory: Inventory;
    transform: Transform;
    playerData: PlayerData;
  }>;
  ws: WebSocket;
  wss: WebSocketServer;
  sendSerialized: (data: ArrayBuffer) => void;
};

const isSocketOpen = (ws: WebSocket): boolean => ws.readyState === WebSocket.OPEN;

export const send = (receiver: Socket, payload: ServerToClientMessages): void => {
  if (!isSocketOpen(receiver.ws)) {
    console.warn('attempt to send message to closed socket');
    return;
  }
  if ('binaryData' in payload) {
    receiver.sendSerialized(payload.binaryData);
    delete payload.binaryData;
  }
  receiver.ws.send(JSON.stringify(payload));
};

export const broadcast = (receivers: Socket[], payload: ServerToClientMessages): void =>
  receivers.forEach((socket) => send(socket, payload));

export const broadcastToLinked = (
  player: Readonly<{ network: Network }>,
  type: ServerToClientMessage,
  payload: ServerToClientMessages,
): void => player.network.linkedPlayers.forEach(({ network: { socket } }) => send(socket, payload));
