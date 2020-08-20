import { vec3 } from 'gl-matrix';
import type { World } from '../../common/ecs/World';
import type { Time } from '../Time/Time';
import type { System } from '../../common/ecs/System';
import { Transform, Skybox } from '../components';

export default (world: World, time: Time): System => {
  const skyboxes = world.createSelector([Transform, Skybox]);
  world.events
    .filter((e) => e.type === 'SET_DAY_TIME')
    .subscribe(({ type, payload }) => {
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
