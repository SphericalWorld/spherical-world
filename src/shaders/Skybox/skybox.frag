precision mediump float;

#define uDitheringAmmount 0.01
#define uSunSize 10.0
#define M_PI 3.1415926535897932384626433832795

uniform float uTime;
uniform vec4 uLighting;
uniform vec3 uSunPosition;
uniform sampler2D uTexture;

in vec3 outDir;
in vec2 vTextureCoord;

out vec4 color;

highp float random(vec2 co){
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
  highp float dt= dot(co.xy ,vec2(a,b));
  highp float sn= mod(dt,3.14);
  return fract(sin(sn) * c);
}

vec3 hash(vec3 p){
	return vec3(random(vec2(p.x, p.x+p.y+p.z) ));
}

vec3 uSunColor = vec3(1.0, 1.0, 1.0);
// TODO: change from skybox to skydome
void main(void) {
  vec3 direction = normalize(outDir);
  float a = max(0.0, dot(direction, vec3(0.0, 1.0, 0.0)));
  vec3 skyColor = mix(vec3(0.5, 0.5, 0.5), uLighting.rgb, a);
  float sunTheta = max(dot(direction, normalize(uSunPosition)), 0.0);
  vec3 sun = max(sunTheta- (1.0 - uSunSize / 1000.0  ) , 0.0) * uSunColor * 101.0;
  vec3 sunAtmosphere =  max(sunTheta - (1.0 - (uSunSize + 25.0) / 1000.0), 0.0) * uSunColor * 10.0;
  color = max(
    texture(uTexture, vTextureCoord),
    max(
      vec4(skyColor + hash(direction) * uDitheringAmmount, 1.0) * sin(uTime * 2.0 * M_PI - M_PI),
      vec4(sun + sunAtmosphere, 1.0)
    )
  );
}
