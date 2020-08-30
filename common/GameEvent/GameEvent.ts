import type NetworkSync from '../ecs/components/NetworkSync';

type SyncEvent = Readonly<{
  type: 'SYNC_GAME_DATA';
  payload: {
    newObjects: ReadonlyArray<NetworkSync>;
    components: ReadonlyArray<never>;
  };
  network?: boolean;
  dispatchable: boolean;
}>;

export type GameEvent1 =
  | Readonly<{
      type: 'GAME_EVENT_TYPE';
      // +payload?: any;
      network?: boolean;
      dispatchable: boolean;
    }>
  | SyncEvent;
