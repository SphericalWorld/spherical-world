// @flow strict
import WebSocket from 'ws';
import type { Network } from '../components/index';
import type { Entity } from '../../common/ecs/Entity';

export type Socket = {
  player: { +network: Network, +id: Entity };
  ws: WebSocket,
}

const isSocketOpen = (ws: WebSocket): boolean => ws.readyState === WebSocket.OPEN;

export const send = (receiver: Socket, type: string, payload: mixed): void => (
  isSocketOpen(receiver.ws)
    ? receiver.ws.send(JSON.stringify({ type, data: payload }))
    : console.warn('attempt to send message to closed socket'));

export const broadcast = (receivers: Socket[], type: string, payload: mixed): void =>
  receivers.forEach(socket => send(socket, type, payload));

export const broadcastToLinked = (player: { +network: Network }, type: string, payload: mixed): void =>
  player.network.linkedPlayers.forEach(({ network: { socket } }) => send(socket, type, payload));
