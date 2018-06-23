// @flow
import { mat4, vec3 } from 'gl-matrix';
import { MOUSE_BUTTON_PRESSED, MOUSE_BUTTON_RELEASED } from './mouseConstants';
import { playerChangeRotation } from '../player/playerActions';

export const moveMouse = ({
  movementX,
  movementY,
}: {
  movementX: number,
  movementY: number,
}) => dispatch => {
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
