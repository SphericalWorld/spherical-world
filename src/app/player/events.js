// @flow
import GameEventObservable from '../GameEvent/GameEventObservable';

export const CAMERA_MOVED: 'CAMERA_MOVED' = 'CAMERA_MOVED';
export const CAMERA_LOCKED: 'CAMERA_LOCKED' = 'CAMERA_LOCKED';
export const CAMERA_UNLOCKED: 'CAMERA_UNLOCKED' = 'CAMERA_UNLOCKED';
export const PLAYER_MOVED: 'PLAYER_MOVED' = 'PLAYER_MOVED';
export const PLAYER_STOPED_MOVE: 'PLAYER_STOPED_MOVE' = 'PLAYER_STOPED_MOVE';
export const DIRECTION_FORWARD: 'DIRECTION_FORWARD' = 'DIRECTION_FORWARD';
export const DIRECTION_BACK: 'DIRECTION_BACK' = 'DIRECTION_BACK';
export const DIRECTION_LEFT: 'DIRECTION_LEFT' = 'DIRECTION_LEFT';
export const DIRECTION_RIGHT: 'DIRECTION_RIGHT' = 'DIRECTION_RIGHT';

export const cameraMovedObservable = new GameEventObservable();
export const cameraLockedObservable = new GameEventObservable();
export const cameraUnlockedObservable = new GameEventObservable();
export const playerMovedObservable = new GameEventObservable();
export const playerStopedMoveObservable = new GameEventObservable();
