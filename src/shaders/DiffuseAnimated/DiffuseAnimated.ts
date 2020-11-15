import { gl } from '../../engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import type { TexturableShader } from '../TexturableShader';
import vertexShaderData from './diffuseAnimated.vert';
import fragmentShaderData from './diffuseAnimated.frag';

export default class DiffuseAnimatedProgram extends GlShaderProgram implements TexturableShader {
  name = 'diffuseAnimated';

  aVertexPosition = this.createAttribute('aVertexPosition');
  aTextureCoord = this.createAttribute('aTextureCoord');

  uPMatrix = this.createUniform('uPMatrix');
  uMVMatrix = this.createUniform('uMVMatrix');
  uLighting = this.createUniform('uLighting');
  uTexture = this.createUniform('uTexture');
  uFrame = this.createUniform('uFrame');

  constructor() {
    super(new GlVertexShader(vertexShaderData), new GlFragmentShader(fragmentShaderData));
    this.use();
    gl.uniform1i(this.uTexture, 0);
    this.animate(0);
  }

  animate(frame: number): void {
    gl.uniform1ui(this.uFrame, frame);
  }
}
