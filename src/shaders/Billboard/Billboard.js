// @flow
import { gl } from '../../app/engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../app/engine/glShader';
import vertexShaderData from './billboard.vert';
import fragmentShaderData from './billboard.frag';

export default class BillboardProgram extends GlShaderProgram {
  name = 'billboard';
  vertexShader = new GlVertexShader(vertexShaderData);
  fragmentShader = new GlFragmentShader(fragmentShaderData);

  attributes = ['aVertexPosition', 'aTextureCoord'];
  uniforms = ['uPMatrix', 'uMVMatrix', 'uTexture', 'uLighting'];

  uTexture: WebGLUniformLocation;

  constructor() {
    super();
    this.link();
    this.use();
    gl.uniform1i(this.uTexture, 0);
  }
}
