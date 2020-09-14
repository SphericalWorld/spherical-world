precision mediump float;

uniform sampler2D uTexture;

in vec2 vTextureCoord;

out vec4 color;

void main(void) {
  vec4 texColor = texture(uTexture, vTextureCoord);

  color = texColor;
}

