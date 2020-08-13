in vec3 aVertexPosition;

//uniform SceneUniforms {
//    mat4 uPMatrix;
//    vec4 eyePosition;
//} uScene; // make proj matrix scene level uniform!

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;

void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
