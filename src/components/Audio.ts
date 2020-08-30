import type { Component } from '../../common/ecs/Component';
import type GlObject from '../engine/glObject';
import { THREAD_MAIN } from '../Thread/threadConstants';
import type { Sound } from '../Sound';

export default class Audio implements Component {
  static threads = [THREAD_MAIN];
  static componentName: 'audio' = 'audio';

  loop: boolean;
  volume: number;
  sound: Sound;

  constructor({
    volume = 1,
    sound,
    loop = false,
  }: {
    volume?: number;
    sound: Sound;
    loop?: boolean;
  }) {
    this.volume = volume;
    this.sound = sound;
    this.loop = loop;
  }
}

/**
 * Component with data to play sound
 */
export const AudioComponent = ({ object }: { object: GlObject }): JSX.Element => new Audio(object);
