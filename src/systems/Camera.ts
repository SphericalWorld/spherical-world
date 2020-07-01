import { mat4, quat, vec3, vec4 } from 'gl-matrix';
import type { World } from '../../common/ecs';
import type { Viewport } from '../components/Camera';
import type { Input } from '../Input/Input';
import { PLAYER_CAMERA_HEIGHT } from '../../common/player';
import { gl } from '../engine/glEngine';
import { GAMEPLAY_MAIN_CONTEXT, GAMEPLAY_MENU_CONTEXT } from '../Input/inputContexts';
import type { System } from '../../common/ecs/System';
import { Transform, Camera } from '../components';
import { CAMERA_LOCKED, CAMERA_UNLOCKED, CAMERA_MOVED } from '../player/events';
import { unproject } from '../../common/utils/vector';

const resizeViewport = (viewport: Viewport): void => {
  const width = gl.canvas.clientWidth;
  const height = gl.canvas.clientHeight;
  if (gl.canvas.width !== width || gl.canvas.height !== height) {
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    viewport.viewportWidth = gl.drawingBufferWidth;
    viewport.viewportHeight = gl.drawingBufferHeight;
    mat4.copy(
      viewport.pMatrix,
      mat4.perspective(
        mat4.create(),
        1.04719755,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1024.0,
      ),
    );
    // return {
    //   viewportWidth: gl.drawingBufferWidth,
    //   viewportHeight: gl.drawingBufferHeight,
    //   pMatrix: mat4.perspective(
    //     mat4.create(),
    //     1.04719755,
    //     gl.drawingBufferWidth / gl.drawingBufferHeight,
    //     0.1,
    //     1024.0,
    //   ), // 60 degrees = (1.04719755 radian), distance of view [0.1, 512]
    // };
  }
  // return viewport;
};

const getWorldPosition = (distance: number) => (
  width: number,
  height: number,
  pMatrix: mat4,
  mvMatrix: mat4,
) =>
  unproject(
    width / 2,
    height / 2,
    distance,
    mat4.multiply(mat4.create(), pMatrix, mvMatrix),
    vec4.fromValues(0, 0, width, height),
  );

const getWorldPositionNear = getWorldPosition(0);
const getWorldPositionFar = getWorldPosition(1);

const getCameraMovements = (world: World) =>
  world.events.filter((el) => el.type === CAMERA_MOVED).subscribeQueue();

const sumCameraMovements = ([x, y]: [number, number], { payload }) => [
  x + payload.x,
  y + payload.y,
];

export default (world: World, input: Input): System => {
  const cameras = world.createSelector([Transform, Camera]);
  const bodyElement = document.getElementsByTagName('body')[0];

  const cameraMovements = getCameraMovements(world);

  world.events
    .filter((el) => el.type === CAMERA_LOCKED)
    .subscribe(() => {
      input.deactivateContext(GAMEPLAY_MENU_CONTEXT);
      input.activateContext(GAMEPLAY_MAIN_CONTEXT);
      bodyElement.requestPointerLock();
    });

  world.events
    .filter((el) => el.type === CAMERA_UNLOCKED)
    .subscribe(() => {
      input.deactivateContext(GAMEPLAY_MAIN_CONTEXT);
      input.activateContext(GAMEPLAY_MENU_CONTEXT);
    });

  const cameraSystem = () => {
    const movement = cameraMovements.events.reduce(sumCameraMovements, [0, 0]);
    const [{ id, transform, camera }] = cameras;
    resizeViewport(camera.viewport);

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
    mat4.translate(camera.mvMatrix, camera.mvMatrix, [
      -translation[0],
      -translation[1] - PLAYER_CAMERA_HEIGHT,
      -translation[2],
    ]);
    cameraMovements.clear();

    const sight = vec3.create();
    const {
      viewport: { viewportWidth, viewportHeight, pMatrix },
      mvMatrix,
    } = camera;
    const worldPosition = getWorldPositionFar(viewportWidth, viewportHeight, pMatrix, mvMatrix);
    const worldPositionNear = getWorldPositionNear(
      viewportWidth,
      viewportHeight,
      pMatrix,
      mvMatrix,
    );
    vec3.subtract(sight, worldPosition, worldPositionNear);
    vec3.normalize(sight, sight);

    vec3.copy(camera.worldPosition, worldPositionNear);
    vec3.copy(camera.sight, sight);
  };
  return cameraSystem;
};
