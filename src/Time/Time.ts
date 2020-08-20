const HOURS_IN_DAY: 24 = 24;
const MINUTES_IN_HOUR: 60 = 60;
// const MINUTES_IN_HOUR: 60 = 1;
const SECONDS_IN_MINUTE: 1 = 1;
const MILLISECONDS_IN_SECOND: 1000 = 1000;
const MILLISECONDS_IN_DAY: number =
  HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
const MILLISECONDS_IN_HOUR: number = MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
const MILLISECONDS_IN_MINUTE: number = SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

const timeProvider = () => {
  class Time {
    currentTime = 0;
    currentTimeFromStart = 0;
    day = 0;
    hour = 0;
    minute = 0;
    dayLightLevel = 0;
    dayPercent = 0;
    startingTime = 0;

    constructor(startingTime: number) {
      this.currentTime = startingTime;
      this.startingTime = startingTime;
    }

    update(delta: number): void {
      this.currentTime += delta * 1000;
      const time = this.currentTime + MILLISECONDS_IN_DAY / 4;
      this.currentTimeFromStart = time - this.startingTime;
      this.day = Math.floor(time / MILLISECONDS_IN_DAY);
      this.hour = Math.floor((time / MILLISECONDS_IN_HOUR) % HOURS_IN_DAY);
      this.minute = Math.floor((time / MILLISECONDS_IN_MINUTE) % MINUTES_IN_HOUR);
      this.dayPercent = (time % MILLISECONDS_IN_DAY) / MILLISECONDS_IN_DAY;
      this.dayLightLevel = Math.sin(this.dayPercent * 2 * Math.PI);
      if (time > MILLISECONDS_IN_DAY) {
        this.currentTime -= MILLISECONDS_IN_DAY;
      }
    }

    set(time: number) {
      this.currentTime = time;
    }

    setHoursMinutes(time: string) {
      const [hours, minutes] = time.split(':');
      const dayTimePercent = (parseInt(hours, 10) * 60 + parseInt(minutes, 10)) / (24 * 60);
      this.set(dayTimePercent * MILLISECONDS_IN_DAY);
    }
  }

  return Time;
};

export type Time = InstanceType<ReturnType<typeof timeProvider>>;

export default timeProvider;
