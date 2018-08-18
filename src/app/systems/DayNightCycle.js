// @flow
import { vec3 } from 'gl-matrix';
import type World from '../ecs/World';
import type { Time } from '../Time/Time';
import { System } from './System';
import { Transform, Skybox } from '../components';


export default (world: World, time: Time) =>
  class DayNightCycle implements System {
    mvMatrixStack = [];
    mvMatrix: number[];
    pMatrix: number[];
    skybox = world.createSelector([Transform, Skybox]);

    update(delta: number): void {
      time.update(Date.now());
      const { day, hour, minute } = time;
      const [{ id, skybox }] = this.skybox;
      const sunPositionOnCircle = time.dayPercent * 2 * Math.PI - Math.PI;
      vec3.set(skybox.sunPosition, Math.cos(sunPositionOnCircle), Math.sin(sunPositionOnCircle), 0);
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
  };
