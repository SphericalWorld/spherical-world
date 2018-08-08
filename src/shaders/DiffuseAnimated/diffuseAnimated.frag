precision mediump float;
precision mediump sampler2DArray;

uniform sampler2DArray uTexture;
uniform vec4 uLighting;
uniform uint uFrame;

in vec2 vTextureCoord;

out vec4 color;

void main(void) {
  vec4 texColor = texture(uTexture, vec3(vTextureCoord, uFrame));
  color = texColor * uLighting;
}
