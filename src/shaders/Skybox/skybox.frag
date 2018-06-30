precision mediump float;

#define uDitheringAmmount 0.01
#define uSunSize 10.0

uniform float time;
uniform vec4 uLighting;
uniform vec3 uSunPosition;

out vec4 color;
in vec3 outDir;

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
  vec3 sun = max(sunTheta- (1.0 - uSunSize / 1000.0  ) , 0.0) * uSunColor * 51.0;
  vec3 sunAtmosphere =  max(sunTheta - (1.0 - (uSunSize + 25.0) / 1000.0), 0.0) * uSunColor * 10.0;
  color = vec4(skyColor +(sun + sunAtmosphere) +  hash(direction) * uDitheringAmmount, 1.0);
}
