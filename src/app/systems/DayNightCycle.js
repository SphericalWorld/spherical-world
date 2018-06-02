// @flow
import { System } from './System';
import { Transform, Visual, Skybox } from '../components';
import type World from '../ecs/World';
import { Time } from '../Time/Time';

const dayNightCycleProvider = (world: World, time: Time) => {
  // @connect(mapState, null, store)
  class DayNightCycle implements System {
    mvMatrixStack = [];
    mvMatrix: number[];
    pMatrix: number[];
    currentShader: WebGLProgram;

    update(delta: number): void {
      time.update(delta);
      const { day, hour, minute } = time;
      // for (const [id, position, visual] of this.components) {
      //   if (visual.glObject.material.transparent) {
      //     continue;
      //   }
      //   draw(position, visual);
      // }
    }
  }

  return DayNightCycle;
};

export default dayNightCycleProvider;
