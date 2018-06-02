precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec4 uLighting;

#define iterations 13
#define formuparam 0.730

#define volsteps 2
#define stepsize 0.120

#define zoom   5.0
#define tile   1.5
#define speed  0.0001

#define brightness 0.0005
#define darkmatter 0.000
#define distfading 0.460
#define saturation 0.200

out vec4 color;


void main(void) {
  //get coords and direction
  vec2 uv=gl_FragCoord.xy/resolution.xy-.5;
  uv.y*=resolution.y/resolution.x;
  vec3 dir=vec3(uv*zoom,1.);

  float a2=time*speed+.25;
  float a1=0.0;
  mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
  mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
  dir.xz*=rot1;
  dir.xy*=rot2;

  //from.x-=time;
  //mouse movement
  vec3 from=vec3(0.,0.,0.);
  from+=vec3(time*2.,time,-2.);

  from.x-=mouse.x;
  from.y-=mouse.y;

  from.xz*=rot1;
  from.xy*=rot2;

  //volumetric rendering
  float s=0.4,fade=1.;
  vec3 v=vec3(0.);
  for (int r=0; r<volsteps; r++) {
    vec3 p=from+s*dir*.5;
    p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
    float pa,a=pa=0.;
    for (int i=0; i<iterations; i++) {
      p=abs(p)/dot(p,p)-formuparam; // the magic formula
      a+=abs(length(p)-pa); // absolute sum of average change
      pa=length(p);
    }
    //float dm=max(0.,darkmatter-a*a*.001); //dark matter
    float dm=0.0;
    a*=a*a*2.; // add contrast
    //if (r>3) fade*=1.-dm; // dark matter, don't render near
    //v+=vec3(dm,dm*.5,0.);
    v+=fade;
    v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
    fade*=distfading; // distance fading
    s+=stepsize;
  }
  v=mix(vec3(length(v)),v,saturation); //color adjust
  color = max(vec4(v*.005,1.)*uLighting.a*uLighting.a, vec4(uLighting.r, uLighting.g, uLighting.b, 1));
}



//
//
//
// varying vec3 vWorldPosition;
// varying vec3 vSunDirection;
// varying float vSunfade;
// varying vec3 vBetaR;
// varying vec3 vBetaM;
// varying float vSunE;
// uniform float luminance;
// uniform float mieDirectionalG;
// const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );
// const float pi = 3.141592653589793238462643383279502884197169;
// const float n = 1.0003;
// const float N = 2.545E25;
// const float rayleighZenithLength = 8.4E3;
// const float mieZenithLength = 1.25E3;
// const vec3 up = vec3( 0.0, 1.0, 0.0 );
// const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;
// const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
// const float ONE_OVER_FOURPI = 0.07957747154594767;
// float rayleighPhase( float cosTheta ) {
// 	return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
// }
// float hgPhase( float cosTheta, float g ) {
// 	float g2 = pow( g, 2.0 );
// 	float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
// 	return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
// }
// const float A = 0.15;
// const float B = 0.50;
// const float C = 0.10;
// const float D = 0.20;
// const float E = 0.02;
// const float F = 0.30;
// const float whiteScale = 1.0748724675633854;
// vec3 Uncharted2Tonemap( vec3 x ) {
// 	return ( ( x * ( A * x + C * B ) + D * E ) / ( x * ( A * x + B ) + D * F ) ) - E / F;
// }
// void main() {
// 	float zenithAngle = acos( max( 0.0, dot( up, normalize( vWorldPosition - cameraPos ) ) ) );
// 	float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
// 	float sR = rayleighZenithLength * inverse;
// 	float sM = mieZenithLength * inverse;
// 	vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );
// 	float cosTheta = dot( normalize( vWorldPosition - cameraPos ), vSunDirection );
// 	float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
// 	vec3 betaRTheta = vBetaR * rPhase;
// 	float mPhase = hgPhase( cosTheta, mieDirectionalG );
// 	vec3 betaMTheta = vBetaM * mPhase;
// 	vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
// 	Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );
// 	vec3 direction = normalize( vWorldPosition - cameraPos );
// 	float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
// 	float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
// 	vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
// 	vec3 L0 = vec3( 0.1 ) * Fex;
// 	float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
// 	L0 += ( vSunE * 19000.0 * Fex ) * sundisk;
// 	vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );
// 	vec3 curr = Uncharted2Tonemap( ( log2( 2.0 / pow( luminance, 4.0 ) ) ) * texColor );
// 	vec3 color = curr * whiteScale;
// 	vec3 retColor = pow( color, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );
// 	gl_FragColor = vec4( retColor, 1.0 );
// }
