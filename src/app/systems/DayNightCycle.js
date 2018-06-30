// @flow
import { vec3 } from 'gl-matrix';
import type { Entity } from '../ecs/Entity';
import type World from '../ecs/World';
import type { Time } from '../Time/Time';
import { System } from './System';
import { Transform, Skybox } from '../components';


const dayNightCycleProvider = (world: World, time: Time) => {
  class DayNightCycle implements System {
    mvMatrixStack = [];
    mvMatrix: number[];
    pMatrix: number[];
    skybox: {
      id: Entity,
      transform: Transform,
      skybox: Skybox,
    }[] = world.createSelector([Transform, Skybox]);

    update(delta: number): void {
      time.update(Date.now());
      const { day, hour, minute } = time;
      const [{ id, skybox }] = this.skybox;
      vec3.set(skybox.sunPosition, Math.cos(time.dayPercent * 2 * Math.PI - Math.PI), Math.sin(time.dayPercent * 2 * Math.PI- Math.PI), 0);
      // console.log(sunPos)
      // console.log(day, hour, minute, delta)
      // for (const [id, position, visual] of this.components) {
      //   if (visual.glObject.material.transparent) {
      //     continue;
      //   }
      //   draw(position, visual);
      // }
      return [[id, skybox]];
    }
  }

  return DayNightCycle;
};

export default dayNightCycleProvider;
