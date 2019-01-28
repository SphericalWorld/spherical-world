// @flow strict
import { gl } from '../../engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import { type TexturableShader } from '../TexturableShader';
import vertexShaderData from './diffuseAnimated.vert';
import fragmentShaderData from './diffuseAnimated.frag';

export default class DiffuseAnimatedProgram extends GlShaderProgram implements TexturableShader {
  name = 'diffuseAnimated';

  attributes = ['aVertexPosition', 'aTextureCoord'];
  uniforms = ['uPMatrix', 'uMVMatrix', 'uTexture', 'uLighting', 'uFrame'];

  uTexture: WebGLUniformLocation;
  uFrame: WebGLUniformLocation;
  aVertexPosition = 0;
  aTextureCoord = 0;

  constructor() {
    super(new GlVertexShader(vertexShaderData), new GlFragmentShader(fragmentShaderData));
    this.link();
    this.use();
    gl.uniform1i(this.uTexture, 0);
    this.animate(0);
  }

  animate(frame: number): void {
    gl.uniform1ui(this.uFrame, frame);
  }
}
