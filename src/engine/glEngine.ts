export const canvas = document.getElementById('glcanvas');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error();
}

const getContext = () => {
  const gl = canvas.getContext('webgl2', { antialias: false });
  if (!gl) {
    throw new Error('Can not initialize webgl2 context');
  }
  return gl;
};

const gl = getContext();

export const initWebGL = () => {
  try {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
  } catch (e) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
  }
};

export { gl };
