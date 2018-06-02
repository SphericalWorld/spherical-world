precision mediump float;

precision mediump sampler2DArray;

uniform sampler2DArray uTexture;
uniform vec3 uLighting;

in vec2  vTextureCoord;

out vec4 color;

void main(void) {
  vec4 texColor = texture(uTexture, vec3(vTextureCoord, 0));
  color = texColor * vec4(uLighting[0], uLighting[1], uLighting[2], 1.0);

  if (color.a<0.5)
    discard;
}
