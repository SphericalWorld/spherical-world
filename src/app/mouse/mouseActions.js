// @flow
import { mat4, vec3 } from 'gl-matrix';
import { MOUSE_MOVED, MOUSE_BUTTON_PRESSED, MOUSE_BUTTON_RELEASED } from './mouseConstants';
import { playerChangeRotation } from '../player/playerActions';

export const updateMouseWorldPosition = () => (dispatch, getState) => {
  const state = getState();
  const {
    viewportWidth, viewportHeight, mvMatrix, pMatrix,
  } = state.camera;
  const sightRay = vec3.create();
  const sight = vec3.create();

  const worldPosition = vec3.unproject(viewportWidth / 2, viewportHeight / 2, 1, mat4.multiply([], pMatrix, mvMatrix), [0, 0, viewportWidth, viewportHeight]);
  const worldPositionNear = vec3.unproject(viewportWidth / 2, viewportHeight / 2, 0, mat4.multiply([], pMatrix, mvMatrix), [0, 0, viewportWidth, viewportHeight]);
  vec3.subtract(sightRay, worldPosition, worldPositionNear);
  vec3.normalize(sight, sightRay);

  dispatch({
    type: MOUSE_MOVED,
    payload: {
      worldPositionNear,
      worldPosition,
      sight,
    },
    meta: {
      worker: true,
    },
  });
}

export const moveMouse = ({
  movementX,
  movementY,
}: {
  movementX: number,
  movementY: number,
}) => dispatch => {
  dispatch(updateMouseWorldPosition());
  dispatch(playerChangeRotation(movementX, movementY));
};

export const mousePress = ({ button }: { button: number }) => ({
  type: MOUSE_BUTTON_PRESSED,
  payload: {
    [button]: true,
  },
});

export const mouseRelease = ({ button }: { button: number }) => ({
  type: MOUSE_BUTTON_RELEASED,
  payload: {
    [button]: false,
  },
});
