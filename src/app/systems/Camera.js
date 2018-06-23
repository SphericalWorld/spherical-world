// @flow
import type { Mat4 } from 'gl-matrix';
import { mat4, quat, vec3 } from 'gl-matrix';
import type { World } from '../ecs';
import type { Entity } from '../ecs/Entity';
import type { Viewport } from '../components/Camera';
import { gl } from '../engine/glEngine';
import GameEventQueue from '../GameEvent/GameEventQueue';
import GameplayMainContext from '../Input/inputContexts/GameplayMainContext';
import GameplayMenuContext from '../Input/inputContexts/GameplayMenuContext';
import { System } from './System';
import { Transform, Camera } from '../components';
import { cameraMovedObservable, cameraLockedObservable, cameraUnlockedObservable } from '../player/events';

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
      pMatrix: mat4.perspective(mat4.create(), 1.04719755, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1024.0),  // 60 degrees = (1.04719755 radian), distance of view [0.1, 512]
    }
  }
  return viewport;
}

const cameraProvider = (world: World) => {
  class CameraSystem implements System {
    camera: {
      id: Entity,
      transform: Transform,
      camera: Camera,
    }[] = world.createSelector([Transform, Camera]);
    cameraMovements: GameEventQueue = new GameEventQueue(cameraMovedObservable);
    bodyElement: HTMLElement = document.getElementsByTagName('body')[0];

    mvMatrix: Mat4;
    pMatrix: Mat4;

    constructor() {
      cameraLockedObservable.subscribe(() => {
        world.input.deactivateContext(GameplayMenuContext);
        world.input.activateContext(GameplayMainContext);
        this.bodyElement.requestPointerLock();
      });
      cameraUnlockedObservable.subscribe(() => {
        world.input.deactivateContext(GameplayMainContext);
        world.input.activateContext(GameplayMenuContext);
      });
    }

    update(delta: number): void {
      const movement = this.cameraMovements.events.reduce(([x, y], { inputEvent }) => ([x + inputEvent.x, y + inputEvent.y]), [0, 0]);
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
      mat4.translate(camera.mvMatrix, camera.mvMatrix, [-translation[0], -translation[1] - 0.6, -translation[2]]);
      // console.log(camera.mvMatrix);
      this.cameraMovements.clear();

      const sight = vec3.create();
      const {
        viewport: { viewportWidth, viewportHeight, pMatrix },
        mvMatrix,
      } = camera;
      const worldPosition = vec3.unproject(viewportWidth / 2, viewportHeight / 2, 1, mat4.multiply([], pMatrix, mvMatrix), [0, 0, viewportWidth, viewportHeight]);
      const worldPositionNear = vec3.unproject(viewportWidth / 2, viewportHeight / 2, 0, mat4.multiply([], pMatrix, mvMatrix), [0, 0, viewportWidth, viewportHeight]);
      vec3.subtract(sight, worldPosition, worldPositionNear);
      vec3.normalize(sight, sight);

      camera.worldPosition = worldPositionNear;
      camera.sight = sight;
      return [[id, transform, camera]];
    }
  }

  return CameraSystem;
};

export default cameraProvider;
