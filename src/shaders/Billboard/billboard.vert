precision mediump float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

out vec2 vTextureCoord;

void main(void) {
  vTextureCoord = aTextureCoord;
  gl_Position = uPMatrix * (vec4(aVertexPosition, 1.0) + vec4(uMVMatrix[3].xyz, 0));
}
