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
    currentTime: number;
    day: number;
    hour: number;
    minute: number;
    dayLightLevel: number;

    constructor(startingTime: number) {
      this.currentTime = startingTime;
    }

    update(time: number): void {
      this.currentTime = time;
      this.day = Math.floor(time / MILLISECONDS_IN_DAY);
      this.hour = Math.floor((time / MILLISECONDS_IN_HOUR) % HOURS_IN_DAY);
      this.minute = Math.floor((time / MILLISECONDS_IN_MINUTE) % MINUTES_IN_HOUR);
      this.dayLightLevel = Math.sin(((time % MILLISECONDS_IN_DAY) / MILLISECONDS_IN_DAY) * 2 * Math.PI);
    }
  }
  return Time;
};

/* ::
export const Time = timeProvider();
*/

export default timeProvider;
