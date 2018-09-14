// @flow
const HOURS_IN_DAY: 24 = 24;
const MINUTES_IN_HOUR: 60 = 60;
// const MINUTES_IN_HOUR: 60 = 1;
const SECONDS_IN_MINUTE: 1 = 1;
const MILLISECONDS_IN_SECOND: 1000 = 1000;
const MILLISECONDS_IN_DAY: number = HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
const MILLISECONDS_IN_HOUR: number = MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
const MILLISECONDS_IN_MINUTE: number = SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

const timeProvider = () => {
  class Time {
    currentTime: number = 0;
    currentTimeFromStart: number = 0;
    day: number = 0;
    hour: number = 0;
    minute: number = 0;
    dayLightLevel: number = 0;
    dayPercent: number = 0;
    startingTime: number = 0;

    constructor(startingTime: number) {
      this.currentTime = startingTime;
      this.startingTime = startingTime;
    }

    update(time: number): void {
      this.currentTime = time;
      this.currentTimeFromStart = time - this.startingTime;
      this.day = Math.floor(time / MILLISECONDS_IN_DAY);
      this.hour = Math.floor((time / MILLISECONDS_IN_HOUR) % HOURS_IN_DAY);
      this.minute = Math.floor((time / MILLISECONDS_IN_MINUTE) % MINUTES_IN_HOUR);
      this.dayPercent = (time % MILLISECONDS_IN_DAY) / MILLISECONDS_IN_DAY;
      this.dayLightLevel = Math.sin((this.dayPercent) * 2 * Math.PI);
    }
  }

  return Time;
};

declare var tmp: $Call<typeof timeProvider>;
export type Time = tmp;

export default timeProvider;
