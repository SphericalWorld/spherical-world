// @flow strict
export const canvas = document.getElementById('glcanvas');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error();
}

type WebGLVertexArrayObject = {||};

type WebGL2Additions = {
  +bindVertexArray: (context: ?WebGLVertexArrayObject) => void,
  +createVertexArray: () => WebGLVertexArrayObject,
}

type WebGL2Context = WebGLRenderingContext & WebGL2Additions;

const gl: ?WebGL2Context = (canvas.getContext('webgl2', { antialias: false }): WebGLRenderingContext);
if (!gl) {
  throw new Error('Can not initialize webgl2 context');
}

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

export { gl };
