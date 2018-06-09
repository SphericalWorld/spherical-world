// @flow
import type { Mat4 } from 'gl-matrix';
import { mat4 } from 'gl-matrix';
import type { Entity } from '../ecs/Entity';
import type World from '../ecs/World';
import type { System } from './System';

import { gl } from '../engine/glEngine';
import { GlShaderProgram } from '../engine/glShader';
import { Transform, Visual, Skybox, Camera } from '../components';
import { connect } from '../util';
import { Time } from '../Time/Time';
import Gradient from '../gradient';
import { Terrain } from '../Terrain/Terrain';

const drawProvider = (store, world: World, terrain: Terrain, time: Time) => {
  class Draw implements System {
    world: World;
    components: {
      id: Entity,
      transform: Transform,
      visual: Visual,
    }[] = world.createSelector([Transform, Visual], [Skybox]);
    skybox: {
      id: Entity,
      transform: Transform,
      visual: Visual,
      skybox: Skybox,
    }[] = world.createSelector([Transform, Visual, Skybox]);
    camera: {
      id: Entity,
      camera: Camera,
    }[] = world.createSelector([Camera]);

    mvMatrixStack = [];
    mvMatrix: Mat4;
    pMatrix: Mat4;
    currentShader: WebGLProgram;
    skyColorGradient: Gradient = new Gradient([[0, 0x8cd3ff], [33, 0xffe899], [53, 0xff8b56], [87, 0x1C1C7C], [100, 0x1a1a1a]]);
    lightColorGradient: Gradient = new Gradient([[0, 0xFFFFFF], [15, 0xEDEDC9], [28, 0xffffd8], [40, 0xDBBB48], [57, 0x893C18], [71, 0x41035B], [87, 0x1C1C5B], [100, 0x1a1a1a]]);

    update(currentTime: number): void {
      const { camera } = this.camera[0];
      this.mvMatrix = camera.mvMatrix;

      this.resize();
      gl.clear(gl.DEPTH_BUFFER_BIT);
      // terrain.material.shader.use()
      this.useShader(terrain.material.shader);

      gl.uniform1f(terrain.material.shader.uTime, 1000); // TODO remove

      let skyColor = Math.floor(this.skyColorGradient.getAtPosition(50 * (time.dayLightLevel + 1)));
      skyColor = [((skyColor & 0xFF0000) >> 16) / 256, ((skyColor & 0xFF00) >> 8) / 256, (skyColor & 0xFF) / 256, (time.dayLightLevel + 1) / 2];

      this.setMatrixUniforms();
      this.dayTime = Math.asin(-1);

      const dayLightLevel = (Math.sin(this.dayTime) + 1) * 50;
      const color = Math.floor(this.lightColorGradient.getAtPosition(dayLightLevel));
      const globalColor = [((color & 0xFF0000) >> 16) / 256, ((color & 0xFF00) >> 8) / 256, (color & 0xFF) / 256, 1];

      terrain.draw(skyColor, globalColor, this.pMatrix, this.mvMatrix);
      const draw = (position: Transform, visual: Visual): void => {
        this.useShader(visual.glObject.material.shader);
        visual.glObject.material.use();
        gl.uniform4f(this.currentShader.uLighting, 1, 1, 1, 1);
        this.mvPushMatrix();
        mat4.translate(this.mvMatrix, this.mvMatrix, position.translation);
        this.setMatrixUniforms();
        visual.glObject.draw();
        this.mvPopMatrix();
        // console.log(position.translation);
      };

      for (const { transform, visual } of this.components) {
        if (visual.glObject.material.transparent) {
          continue;
        }
        draw(transform, visual);
      }

      for (const { transform, visual } of this.skybox) {
        this.useShader(visual.glObject.material.shader);
        visual.glObject.material.use();

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.uniform4f(this.currentShader.uLighting, ...skyColor);
        gl.uniform1f(this.currentShader.time, time.currentTime / 50000000);

        gl.uniform2f(this.currentShader.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
        // gl.uniform2f(this.currentShader.mouse, this.player.horizontalRotate * 0.5, -this.player.verticalRotate * 0.5);

        this.mvPushMatrix();
        // mat4.translate(this.mvMatrix, this.mvMatrix, [transform.x + this.player.x, transform.y + this.player.y, transform.z + this.player.z]);
        this.setMatrixUniforms();
        visual.glObject.draw();
        this.mvPopMatrix();
      }
      // console.log(this.components);

      for (const { transform, visual } of this.components) {
        if (!visual.glObject.material.transparent) {
          continue;
        }
        draw(transform, visual);
      }
    }

    resize(): void {
      const width = gl.canvas.clientWidth;
      const height = gl.canvas.clientHeight;
      if (gl.canvas.width !== width || gl.canvas.height !== height) {
        gl.canvas.width = width;
        gl.canvas.height = height;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        this.pMatrix = mat4.perspective(mat4.create(), 1.04719755, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1024.0);  // 60 degrees = (1.04719755 radian), distance of view [0.1, 512]
      }
    }

    setMatrixUniforms() {
      gl.uniformMatrix4fv(this.currentShader.uPMatrix, false, this.pMatrix);
      gl.uniformMatrix4fv(this.currentShader.uMVMatrix, false, this.mvMatrix);
    }

    mvPushMatrix() {
      this.mvMatrixStack.push(this.mvMatrix);
      this.mvMatrix = mat4.clone(this.mvMatrix);
    }

    mvPopMatrix() {
      if (!this.mvMatrixStack.length) {
        throw new Error('Can\'t pop from an empty matrix stack.');
      }
      this.mvMatrix = this.mvMatrixStack.pop();
      return this.mvMatrix;
    }

    useShader(shader: GlShaderProgram) {
      // if (this.currentShader === shader) {
      //   return;
      // }
      // console.log(shader.program)
      gl.useProgram(shader.program);
      this.currentShader = shader;
    }
  }
  return connect(null, null, store)(Draw);
};

export default drawProvider;
