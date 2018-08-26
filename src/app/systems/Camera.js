// @flow
import type { Mat4 } from 'gl-matrix';
import {
  mat4, quat, vec3, vec4,
} from 'gl-matrix';
import type { World } from '../ecs';
import type { Viewport } from '../components/Camera';
import { gl, unproject } from '../engine/glEngine';
import GameplayMainContext from '../Input/inputContexts/GameplayMainContext';
import GameplayMenuContext from '../Input/inputContexts/GameplayMenuContext';
import { System } from './System';
import { Transform, Camera } from '../components';
import { CAMERA_LOCKED, CAMERA_UNLOCKED, CAMERA_MOVED } from '../player/events';

const resizeViewport = (viewport: Viewport): Viewport => {
  const width = gl.canvas.clientWidth;
  const height = gl.canvas.clientHeight;
  if (gl.canvas.width !== width || gl.canvas.height !== height) {
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    return {
      viewportWidth: gl.drawingBufferWidth,
      viewportHeight: gl.drawingBufferHeight,
      pMatrix: mat4.perspective(
        mat4.create(),
        1.04719755,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1024.0,
      ), // 60 degrees = (1.04719755 radian), distance of view [0.1, 512]
    };
  }
  return viewport;
};

const getWorldPosition = (distance: number) =>
  (width: number, height: number, pMatrix: Mat4, mvMatrix: Mat4) =>
    unproject(
      width / 2,
      height / 2,
      distance,
      mat4.multiply(mat4.create(), pMatrix, mvMatrix),
      vec4.fromValues(0, 0, width, height),
    );

const getWorldPositionNear = getWorldPosition(0);
const getWorldPositionFar = getWorldPosition(1);

const getCameraMovements = (world: World) => world.events
  .filter(el => el.type === CAMERA_MOVED)
  .subscribeQueue();

export default (world: World) =>
  class CameraSystem implements System {
    camera = world.createSelector([Transform, Camera]);
    bodyElement: HTMLElement = document.getElementsByTagName('body')[0];

    mvMatrix: Mat4;
    pMatrix: Mat4;

    cameraMovements = getCameraMovements(world);

    cameraLockedObserver = world.events
      .filter(el => el.type === CAMERA_LOCKED)
      .subscribe(() => {
        world.input.deactivateContext(GameplayMenuContext);
        world.input.activateContext(GameplayMainContext);
        this.bodyElement.requestPointerLock();
      });

    cameraUnlockedObservable = world.events
      .filter(el => el.type === CAMERA_UNLOCKED)
      .subscribe(() => {
        world.input.deactivateContext(GameplayMainContext);
        world.input.activateContext(GameplayMenuContext);
        this.bodyElement.requestPointerLock();
      });

    update(delta: number): void {
      const movement = this.cameraMovements.events.reduce(([x, y], { payload }) => ([x + payload.x, y + payload.y]), [0, 0]);
      const [{ id, transform, camera }] = this.camera;
      camera.viewport = resizeViewport(camera.viewport);

      const { translation, rotation } = transform;
      camera.yaw += movement[1] * 0.005;
      camera.pitch += movement[0] * 0.005;

      quat.identity(rotation);
      quat.rotateX(rotation, rotation, camera.yaw);
      quat.rotateY(rotation, rotation, camera.pitch);
      quat.normalize(rotation, rotation);
      // quat.rotateY(rotation, rotation, movement[0] * 0.005);
      // quat.rotateX(rotation, rotation, movement[1] * 0.005);
      // quat.fromEuler(rotation, 0, camera.pitch, 0)

      // console.log(rotation)
      mat4.fromQuat(camera.mvMatrix, rotation);
      mat4.translate(camera.mvMatrix, camera.mvMatrix, [-translation[0], -translation[1] - 1.7, -translation[2]]);
      this.cameraMovements.clear();

      const sight = vec3.create();
      const {
        viewport: { viewportWidth, viewportHeight, pMatrix },
        mvMatrix,
      } = camera;
      const worldPosition = getWorldPositionFar(viewportWidth, viewportHeight, pMatrix, mvMatrix);
      const worldPositionNear = getWorldPositionNear(viewportWidth, viewportHeight, pMatrix, mvMatrix);
      vec3.subtract(sight, worldPosition, worldPositionNear);
      vec3.normalize(sight, sight);

      camera.worldPosition = worldPositionNear;
      camera.sight = sight;
      return [[id, transform, camera]];
    }
  };
