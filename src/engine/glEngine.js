// @flow strict
export const canvas = document.getElementById('glcanvas');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error();
}

export const gl: WebGLRenderingContext = canvas.getContext('webgl2', { antialias: false });

export function initWebGL() {
  try {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
  } catch (e) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
  }
}
