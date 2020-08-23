export type ServerToClientMessages =
  | Readonly<{
      type: 'SYNC_GAME_DATA';
      data: {
        components?: never[];
        newObjects?: never[];
        deletedObjects?: never[];
      };
    }>
  | Readonly<{ type: 'GAME_START' }>
  | Readonly<{ type: 'LOGGED_IN'; data: Readonly<{ id: string }> }>
  | Readonly<{ type: 'LOAD_CONTROL_SETTINGS'; data: never }>
  | Readonly<{
      type: 'loadChunk';
      data: Readonly<{
        x: number;
        z: number;
        rainfall: ReadonlyArray<number>;
        temperature: ReadonlyArray<number>;
      }>;
    }>;

export type ClientToServerMessages =
  | Readonly<{
      type: 'SYNC_GAME_DATA';
      data: {
        components?: never[];
        newObjects?: never[];
        deletedObjects?: never[];
      };
    }>
  | Readonly<{ type: 'LOGGED_IN'; data: Readonly<{ id: string }> }>;
