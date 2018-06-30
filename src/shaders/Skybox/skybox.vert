precision mediump float;

in vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 uSunPosition;

out vec3 outDir;

void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  outDir = aVertexPosition;
}
