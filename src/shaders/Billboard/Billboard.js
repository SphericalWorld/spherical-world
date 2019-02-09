// @flow strict
import { gl } from '../../engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import vertexShaderData from './billboard.vert';
import fragmentShaderData from './billboard.frag';

export default class BillboardProgram extends GlShaderProgram {
  name = 'billboard';

  attributes = ['aVertexPosition', 'aTextureCoord'];
  uniforms = ['uPMatrix', 'uMVMatrix', 'uTexture', 'uLighting'];

  uTexture: WebGLUniformLocation;

  constructor() {
    super(new GlVertexShader(vertexShaderData), new GlFragmentShader(fragmentShaderData));
    this.link();
    this.use();
    gl.uniform1i(this.uTexture, 0);
  }
}

export const billboard = new BillboardProgram();
