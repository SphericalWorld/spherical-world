class SoundProcessor {
  context: AudioContext;

  constructor() {
    this.context = new AudioContext();
  }
}

type SoundParams = {
  src: string | ReadonlyArray<string>;
  volume: number;
  lazy?: boolean;
};

export class Sound {
  audioData: HTMLAudioElement | ReadonlyArray<HTMLAudioElement>;
  volume: number;
  isPlaying = false;

  constructor({ src, volume, lazy = false }: SoundParams) {
    if (typeof src === 'string') {
      this.audioData = new Audio(src);
      this.audioData.volume = volume;
      if (lazy) this.audioData.preload = 'none';
    } else {
      this.audioData = src.map((el) => {
        const audio = new Audio(el);
        if (lazy) audio.preload = 'none';
        audio.volume = volume;
        return audio;
      });
    }

    this.volume = volume;
  }

  play(): void {
    // if (this.isPlaying) return;
    // this.isPlaying = true;
    if (this.audioData instanceof HTMLAudioElement) {
      this.audioData.play();
      // this.audioData.onended = () => {
      //   this.isPlaying = false;
      // };
    } else {
      const startIndex = Math.floor(this.audioData.length * Math.random());
      let index = startIndex;
      let audio;
      do {
        audio = this.audioData[index];
        index += 1;
        if (index === this.audioData.length) {
          index = 0;
        }
      } while (!audio.paused && index !== startIndex);
      // if (!audio.paused) {

      // }
      audio.play();

      // audio.onended = () => {
      //   this.isPlaying = false;
      // };
    }
  }
}
