// @flow
import { gl } from '../../app/engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../app/engine/glShader';
import vertexShaderData from './diffuseAnimated.vert';
import fragmentShaderData from './diffuseAnimated.frag';

export default class DiffuseAnimatedProgram extends GlShaderProgram {
  name = 'diffuseAnimated';
  vertexShader = new GlVertexShader(vertexShaderData);
  fragmentShader = new GlFragmentShader(fragmentShaderData);

  attributes = ['aVertexPosition', 'aTextureCoord'];
  uniforms = ['uPMatrix', 'uMVMatrix', 'uTexture', 'uLighting', 'uFrame'];

  uTexture: WebGLUniformLocation;
  uFrame: WebGLUniformLocation;

  constructor() {
    super();
    this.link();
    this.use();
    gl.uniform1i(this.uTexture, 0);
    this.animate(0);
  }

  animate(frame: number): void {
    gl.uniform1ui(this.uFrame, frame);
  }
}
