precision mediump float;

uniform sampler2D uBlocksTexture;
uniform sampler2D uGrassColorMapTexture;
uniform sampler2D uBlocksOverlayTexture;
uniform sampler2D uAnimationTexture;

uniform vec4  uGlobalColor;
uniform vec4  uFogColor;
uniform float uFogDensity;
uniform float uTime;
uniform int   uFogType;
uniform int   uBufferNum;

in vec4  vColor;
in float vGlobalColor;
in float vViewDistance;
in vec2  vTextureCoord;
in vec2  vFoliageGrassTextureCoord;
in float vIsAnimTexture;

out vec4 color;

float getFogFactor(){
  const float LOG2 = 1.442695;
  float fogFactor = exp2( -uFogDensity * uFogDensity * vViewDistance * vViewDistance * LOG2);
  fogFactor = clamp(fogFactor, 0.0, 1.0);
  return fogFactor;
}

vec4 mixWithFog(vec4 valueToMix) {
  float fogFactor = getFogFactor();
  return mix(uFogColor, valueToMix, vec4(fogFactor, fogFactor, fogFactor, 1));
}

// TODO: leaves animation
void main(void) {
  #define GRAPHIC_LEVEL 1
  //TODO: add defines to constants and bind to user graphic settings
  vec4 texColor;
  if (vIsAnimTexture>0.5){
    texColor = texture(uAnimationTexture, vTextureCoord);
  }else{
    texColor = texture(uBlocksTexture, vTextureCoord);
  }
  if (uBufferNum==2){
    color = mixWithFog(texColor * max(vColor, vec4(vGlobalColor, vGlobalColor, vGlobalColor, 1) * uGlobalColor));
  }else{
    if(texColor.a < 0.99)
      discard;
    if (uBufferNum==0){
      color = mixWithFog(texColor * max(vColor, vec4(vGlobalColor, vGlobalColor, vGlobalColor, 1) * uGlobalColor));
    }else if (uBufferNum==1){
      vec4 grassColorMap = texture(uGrassColorMapTexture, vFoliageGrassTextureCoord);
      vec4 grassColorMapOverlay = texture(uBlocksOverlayTexture, vTextureCoord);
      color = mixWithFog((grassColorMap * grassColorMapOverlay + texColor * (1.0-grassColorMapOverlay.a)) * max(vColor, vec4(vGlobalColor, vGlobalColor, vGlobalColor, 1) * uGlobalColor));
    }
  }
}
