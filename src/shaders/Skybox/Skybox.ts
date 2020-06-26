import {
  GlVertexShader,
  GlFragmentShader,
  GlShaderProgram,
} from '../../engine/glShader';
import vertexShaderData from './skybox.vert';
import fragmentShaderData from './skybox.frag';

export default class SkyboxProgram extends GlShaderProgram {
  name = 'skybox';
  attributes = ['aVertexPosition', 'aTextureCoord'];
  uniforms = [
    'uPMatrix',
    'uMVMatrix',
    'uTime',
    'uLighting',
    'uTexture',
    'uSunPosition',
  ];

  uTime: WebGLUniformLocation;
  uLighting: WebGLUniformLocation;
  uSunPosition: WebGLUniformLocation;

  constructor() {
    super(
      new GlVertexShader(vertexShaderData),
      new GlFragmentShader(fragmentShaderData),
    );
    this.link();
  }
}
