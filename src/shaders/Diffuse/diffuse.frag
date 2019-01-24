precision mediump float;

// precision mediump sampler2DArray;
// uniform sampler2DArray uTexture;

uniform sampler2D uTexture;
uniform vec4 uLighting;
uniform vec4 uGlobalColor;

in vec2 vTextureCoord;

out vec4 color;

void main(void) {
  // vec4 texColor = texture(uTexture, vec3(vTextureCoord, 0));
  vec4 texColor = texture(uTexture, vTextureCoord);
  color = texColor * max(
    vec4(uLighting[0], uLighting[1], uLighting[2], 1),
    vec4(uLighting[3], uLighting[3], uLighting[3], 1) * uGlobalColor
  );
}
