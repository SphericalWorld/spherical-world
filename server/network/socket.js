// @flow
import type WebSocket from 'ws';
import type { Network } from '../components/index';
import type { Entity } from '../../common/ecs/Entity';

export type Socket = {
  player: { +network: Network, +id: Entity };
  ws: WebSocket,
  postMessage: Function;
  emit: Function;
  send: Function;
  sendSerialized: Function;
}

export const send = (receiver: Socket, type: string, payload: any): void =>
  receiver.ws.send(JSON.stringify({ type, data: payload }));

export const broadcast = (receivers: Socket[], type: string, payload: any): void =>
  receivers.forEach(socket => send(socket, type, payload));

export const broadcastToLinked = (player: { +network: Network }, type: string, payload: any): void =>
  player.network.linkedPlayers.forEach(({ network: { socket } }) => send(socket, type, payload));
