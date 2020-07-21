import type { System } from '../System';
import type { World } from '../World';
import Script from '../components/Script';

export default (ecs: World): System => {
  const components = ecs.createSelector([Script]);

  const scriptingSystem = (delta: number) => {
    for (const { script } of components) {
      script.process(delta);
    }
  };
  return scriptingSystem;
};
