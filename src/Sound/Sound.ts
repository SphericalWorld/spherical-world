class SoundProcessor {
  context: AudioContext;

  constructor() {
    this.context = new AudioContext();
  }
}

type SoundParams = {
  src: 'string';
};

export class Sound {
  audioData: HTMLAudioElement;

  constructor({ src }: SoundParams) {
    this.audioData = new Audio(src);
  }
}
