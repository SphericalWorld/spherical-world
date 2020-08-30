import { vec3 } from 'gl-matrix';
import type { Time } from '../Time/Time';
import type { System } from '../../common/ecs/System';
import { Transform, Skybox } from '../components';
import { WorldMainThread, GameEvent } from '../Events';

export default (world: WorldMainThread, time: Time): System => {
  const skyboxes = world.createSelector([Transform, Skybox]);
  world.events
    .filter((e) => e.type === GameEvent.setDayTime && e)
    .subscribe(({ payload }) => {
      time.setHoursMinutes(payload);
    });

  const dayNightCycle = (delta: number) => {
    time.update(delta);
    const [{ skybox }] = skyboxes;
    const sunPositionOnCircle = time.dayPercent * 2 * Math.PI - Math.PI;
    vec3.set(skybox.sunPosition, Math.cos(sunPositionOnCircle), Math.sin(sunPositionOnCircle), 0);
    // console.log(sunPos)
    // console.log(day, hour, minute, delta)
    // for (const [id, position, visual] of components) {
    //   if (visual.glObject.material.transparent) {
    //     continue;
    //   }
    //   draw(position, visual);
    // }
  };
  return dayNightCycle;
};
