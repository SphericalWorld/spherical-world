import WebSocket from 'ws';
import type { Network } from '../components/index';
import type { Entity } from '../../common/ecs/Entity';

export type Socket = {
  player: Readonly<{ network: Network, id: Entity }>;
  ws: WebSocket,
}

const isSocketOpen = (ws: WebSocket): boolean => ws.readyState === WebSocket.OPEN;

export const send = (receiver: Socket, type: string, payload: unknown): void => (
  isSocketOpen(receiver.ws)
    ? receiver.ws.send(JSON.stringify({ type, data: payload }))
    : console.warn('attempt to send message to closed socket'));

export const broadcast = (receivers: Socket[], type: string, payload: unknown): void =>
  receivers.forEach(socket => send(socket, type, payload));

export const broadcastToLinked = (player: Readonly<{ network: Network }>, type: string, payload: unknown): void =>
  player.network.linkedPlayers.forEach(({ network: { socket } }) => send(socket, type, payload));
