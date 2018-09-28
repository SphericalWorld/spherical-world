// @flow
import type { Mat4 } from 'gl-matrix';
import { mat4 } from 'gl-matrix';
import type World from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import { gl } from '../engine/glEngine';
import { GlShaderProgram } from '../engine/glShader';
import {
  Transform, Visual, Skybox, Camera,
} from '../components';
import type { Time } from '../Time/Time';
import Gradient from '../gradient';
import { Terrain } from '../Terrain/Terrain';

export default (world: World, terrain: Terrain, time: Time): System => {
  const components = world.createSelector([Transform, Visual], [Skybox]);
  const skyboxes = world.createSelector([Transform, Visual, Skybox]);
  const cameras = world.createSelector([Camera, Transform]);
  const mvMatrixStack = [];
  let mvMatrix: Mat4 = null;
  let pMatrix: Mat4 = null;
  let currentShader: GlShaderProgram = null;
  const skyColorGradient: Gradient = new Gradient([[0, 0x8cd3ff], [33, 0xffe899], [53, 0xff8b56], [87, 0x1C1C7C], [100, 0x1a1a1a]]);
  const lightColorGradient: Gradient = new Gradient([[0, 0xFFFFFF], [15, 0xEDEDC9], [28, 0xffffd8], [40, 0xDBBB48], [57, 0x893C18], [71, 0x41035B], [87, 0x1C1C5B], [100, 0x1a1a1a]]);

  const setMatrixUniforms = () => {
    gl.uniformMatrix4fv(currentShader.uPMatrix, false, pMatrix);
    gl.uniformMatrix4fv(currentShader.uMVMatrix, false, mvMatrix);
  };

  const mvPushMatrix = () => {
    mvMatrixStack.push(mvMatrix);
    mvMatrix = mat4.clone(mvMatrix);
  };

  const mvPopMatrix = () => {
    if (!mvMatrixStack.length) {
      throw new Error('Can\'t pop from an empty matrix stack.');
    }
    mvMatrix = mvMatrixStack.pop();
    return mvMatrix;
  };

  const useShader = (shader: GlShaderProgram) => {
    if (currentShader === shader) {
      return;
    }
    // console.log(shader.program)
    gl.useProgram(shader.program);
    currentShader = shader;
  };

  const drawSystem = () => {
    const [{ camera, transform: cameraPosition }] = cameras;
    mvMatrix = camera.mvMatrix;
    pMatrix = camera.viewport.pMatrix;

    gl.clear(gl.DEPTH_BUFFER_BIT);
    // terrain.material.shader.use()
    useShader(terrain.material.shader);
    gl.uniform1f(terrain.material.shader.uTime, time.currentTimeFromStart / 1000); // TODO remove

    let skyColor = Math.floor(skyColorGradient.getAtPosition(50 * (time.dayLightLevel + 1)));
    skyColor = [((skyColor & 0xFF0000) >> 16) / 256, ((skyColor & 0xFF00) >> 8) / 256, (skyColor & 0xFF) / 256, (time.dayLightLevel + 1) / 2];

    setMatrixUniforms();

    const color = Math.floor(lightColorGradient.getAtPosition(50 * (time.dayLightLevel + 1)));
    const globalColor = [((color & 0xFF0000) >> 16) / 256, ((color & 0xFF00) >> 8) / 256, (color & 0xFF) / 256, 1];
    // console.log(globalColor)s
    terrain.draw(cameraPosition.translation, skyColor, globalColor, pMatrix, mvMatrix);

    const draw = (position: Transform, visual: Visual): void => {
      useShader(visual.glObject.material.shader);
      visual.glObject.material.use();
      gl.uniform4f(currentShader.uLighting, 1, 1, 1, 1);
      mvPushMatrix();
      mat4.translate(mvMatrix, mvMatrix, position.translation);
      mat4.multiply(mvMatrix, mvMatrix, mat4.fromQuat(mat4.create(), position.rotation));
      setMatrixUniforms();
      visual.glObject.draw();
      mvPopMatrix();
    };

    for (const { transform, visual } of components) {
      if (visual.glObject.material.transparent || !visual.enabled) {
        continue;
      }
      draw(transform, visual);
    }

    for (const { transform, visual, skybox } of skyboxes) {
      useShader(visual.glObject.material.shader);
      visual.glObject.material.use();

      gl.uniform1f(currentShader.uTime, time.dayPercent);
      gl.uniform4f(currentShader.uLighting, ...skyColor);
      gl.uniform3f(currentShader.uSunPosition, ...skybox.sunPosition);

      mvPushMatrix();
      mat4.translate(mvMatrix, mvMatrix, transform.translation);

      setMatrixUniforms();
      visual.glObject.draw();
      mvPopMatrix();
    }
    // console.log(components);

    for (const { transform, visual } of components) {
      if (!visual.glObject.material.transparent || !visual.enabled) {
        continue;
      }
      draw(transform, visual);
    }
  };
  return drawSystem;
};
