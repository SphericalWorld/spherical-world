// @flow strict
import { gl } from '../../engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import vertexShaderData from './modelCommon.vert';
import fragmentShaderData from './modelCommon.frag';

export default class ModelCommonProgram extends GlShaderProgram {
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
