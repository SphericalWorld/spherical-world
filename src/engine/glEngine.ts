const getCanvas = () => {
  const canvas = document.getElementById('glcanvas');
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error();
  }
  return canvas;
};

const canvas = getCanvas();

const getContext = () => {
  const gl = canvas.getContext('webgl2', { antialias: false }); // , preserveDrawingBuffer: true
  if (!gl) {
    throw new Error('Can not initialize webgl2 context');
  }
  return gl;
};

const gl = getContext();

export const initWebGL = (): void => {
  try {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
  } catch (e) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
  }
};

export const glCreateBuffer = (): WebGLBuffer => {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('Fatal error: unable to allocate WebGL buffer');
  }
  return buffer;
};

export const glCreateShader = (type: number): WebGLShader => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('Fatal error: unable to create WebGL shader');
  }
  return shader;
};

export const glCreateProgram = (): WebGLProgram => {
  const shader = gl.createProgram();
  if (!shader) {
    throw new Error('Fatal error: unable to create WebGL shader program');
  }
  return shader;
};

export { gl, canvas };
