import { mat4 } from 'gl-matrix';
import type { World } from '../../common/ecs/World';
import type { System } from '../../common/ecs/System';
import { gl } from '../engine/glEngine';
import { GlShaderProgram } from '../engine/glShader';
import { Transform, Visual, Skybox, Camera } from '../components';
import type { Time } from '../Time/Time';
import Gradient from '../gradient';
import Terrain, {
  getVisibleChunks,
  drawOpaqueChunkData,
  drawTransparentChunkData,
} from '../Terrain/Terrain';
import { getLight } from '../../common/terrain';
import type SkyboxProgram from '../shaders/Skybox';

export default (world: World, terrain: Terrain, time: Time): System => {
  const components = world.createSelector([Transform, Visual], [Skybox]);
  const skyboxes = world.createSelector([Transform, Visual, Skybox]);
  const cameras = world.createSelector([Camera, Transform]);
  const mvMatrixStack: mat4[] = [];
  let mvMatrix: mat4 = mat4.create();
  let pMatrix: mat4 = mat4.create();
  let currentShader: GlShaderProgram = null;
  const skyColorGradient: Gradient = new Gradient([
    [0, 0x8cd3ff],
    [33, 0xffe899],
    [53, 0xff8b56],
    [87, 0x1c1c7c],
    [100, 0x1a1a1a],
  ]);
  const lightColorGradient: Gradient = new Gradient([
    [0, 0xffffff],
    [15, 0xededc9],
    [28, 0xffffd8],
    [40, 0xdbbb48],
    [57, 0x893c18],
    [71, 0x41035b],
    [87, 0x1c1c5b],
    [100, 0x1a1a1a],
  ]);

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
      throw new Error("Can't pop from an empty matrix stack.");
    }
    mvMatrix = mvMatrixStack.pop();
    return mvMatrix;
  };

  const runShader = (shader: GlShaderProgram) => {
    if (currentShader === shader) {
      return;
    }
    // console.log(shader.program)
    gl.useProgram(shader.program);
    currentShader = shader;
  };

  const drawSystem = () => {
    const [{ camera, transform: cameraPosition }] = cameras;
    ({
      mvMatrix,
      viewport: { pMatrix },
    } = camera);

    const chunksToRender = getVisibleChunks(terrain, pMatrix, mvMatrix);
    // terrain.material.shader.use()
    runShader(terrain.material.shader);
    gl.uniform1f(terrain.material.shader.uTime, time.currentTimeFromStart / 1000); // TODO remove

    let skyColor = Math.floor(skyColorGradient.getAtPosition(50 * (time.dayLightLevel + 1)));
    skyColor = [
      ((skyColor & 0xff0000) >> 16) / 256,
      ((skyColor & 0xff00) >> 8) / 256,
      (skyColor & 0xff) / 256,
      (time.dayLightLevel + 1) / 2,
    ];

    setMatrixUniforms();

    const color = Math.floor(lightColorGradient.getAtPosition(50 * (time.dayLightLevel + 1)));
    const globalColor = [
      ((color & 0xff0000) >> 16) / 256,
      ((color & 0xff00) >> 8) / 256,
      (color & 0xff) / 256,
      1,
    ];
    // console.log(globalColor)s
    drawOpaqueChunkData(
      terrain,
      cameraPosition.translation,
      skyColor,
      globalColor,
      pMatrix,
      mvMatrix,
      cameraPosition.translation,
    );

    const draw = (position: Transform, visual: Visual): void => {
      runShader(visual.glObject.material.shader);
      visual.glObject.material.use();
      const light = getLight(terrain)(...position.translation);
      if (light) {
        gl.uniform4f(currentShader.uLighting, ...light);
      }
      gl.uniform4f(currentShader.uGlobalColor, ...globalColor);
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
      runShader(visual.glObject.material.shader);
      // eslint-disable-next-line no-unused-expressions
      visual.glObject.material.use();
      currentShader = (currentShader as any) as SkyboxProgram;

      gl.uniform1f(currentShader.uTime, time.dayPercent);
      gl.uniform4f(currentShader.uLighting, ...skyColor);
      gl.uniform3f(currentShader.uSunPosition, ...skybox.sunPosition);

      mvPushMatrix();
      mat4.translate(mvMatrix, mvMatrix, transform.translation);

      setMatrixUniforms();
      visual.glObject.draw();
      mvPopMatrix();
    }
    gl.enable(gl.BLEND);

    runShader(terrain.material.shader);
    drawTransparentChunkData(terrain, cameraPosition.translation, skyColor, globalColor);

    for (const { transform, visual } of components) {
      if (!visual.glObject.material.transparent || !visual.enabled) {
        continue;
      }
      draw(transform, visual);
    }
    gl.disable(gl.BLEND);
  };
  return drawSystem;
};
