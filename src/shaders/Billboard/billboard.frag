precision mediump float;

uniform sampler2D uTexture;
uniform vec3 uLighting;

in vec2  vTextureCoord;

out vec4 color;

void main(void) {
  vec4 texColor = texture(uTexture, vTextureCoord);
  color = texColor * vec4(uLighting[0], uLighting[1], uLighting[2], 1.0);

  if (color.a<0.5)
    discard;
}
