precision mediump float;

in vec3  aVertexPosition;
in vec4  aVertexColor;
in float aVertexGlobalColor;
in vec2  aTextureCoord;
in float aBlockData;

uniform mat4  uMVMatrix;
uniform mat4  uPMatrix;
uniform vec3  uAnimTextures[animTexCount];
uniform float uTime;

out float vGlobalColor;
out float vViewDistance;
out vec4  vColor;
out vec2  vTextureCoord;
out vec2  vFoliageGrassTextureCoord;
out float vIsAnimTexture;

void main(void) {
  const float pi = 3.14159265;
  #define GRAPHIC_LEVEL 1

  vec4 position = vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;
  float x = aVertexPosition[0]/16.0;
  float z = aVertexPosition[2]/16.0;

  vFoliageGrassTextureCoord = vec2(x, z);
  vGlobalColor = aVertexGlobalColor;
  vColor = aVertexColor;
  vViewDistance = length(uMVMatrix * vec4(aVertexPosition, 1.0));

  #if GRAPHIC_LEVEL_CURRENT == GRAPHIC_LEVEL_SIMPLE
  if (aBlockData==129.0 || aBlockData==130.0){
    float grassWeight;
    if (vTextureCoord.t > 0.01) {
      grassWeight = 1.0;
    } else {
      grassWeight = 0.1;
    }
    float speed = 0.5;

    float magnitude = sin((uTime * pi / (28.0)) + position.x + position.z) * 0.1 + 0.1;
      magnitude *= grassWeight * 0.5;
      magnitude *= 1.0;
    float d0 = sin(uTime * pi / (122.0 * speed)) * 3.0 - 1.5 + position.z;
    float d1 = sin(uTime * pi / (152.0 * speed)) * 3.0 - 1.5 + position.x;
    float d2 = cos(uTime * pi / (122.0 * speed)) * 3.0 - 1.5 + position.x;
    float d3 = cos(uTime * pi / (152.0 * speed)) * 3.0 - 1.5 + position.z;
    position.x += sin((uTime * pi / (28.0 * speed)) + (position.x + d0) * 0.1 + (position.z + d1) * 0.1) * magnitude * (1.0 + 1.0 * 1.4);
    position.z += cos((uTime * pi / (28.0 * speed)) + (position.z + d2) * 0.1 + (position.x + d3) * 0.1) * magnitude * (1.0 + 1.0 * 1.4);
  }
  #endif
  for (int i=0; i<animTexCount; i++){
    if (uAnimTextures[i].x == aBlockData){
      vTextureCoord.x+=uAnimTextures[i].y;
      vTextureCoord.y+=uAnimTextures[i].z;
      vIsAnimTexture = 1.0;
    }
  }
  gl_Position = uPMatrix * uMVMatrix * position;
}
