import { gl } from '../../engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import type { TexturableShader } from '../TexturableShader';
import vertexShaderData from './diffuse.vert';
import fragmentShaderData from './diffuse.frag';

export default class DiffuseProgram extends GlShaderProgram implements TexturableShader {
  name = 'diffuse';

  aVertexPosition = this.createAttribute('aVertexPosition');
  aTextureCoord = this.createAttribute('aTextureCoord');

  uPMatrix = this.createUniform('uPMatrix');
  uMVMatrix = this.createUniform('uMVMatrix');
  uLighting = this.createUniform('uLighting');
  uTexture = this.createUniform('uTexture');
  uGlobalColor = this.createUniform('uGlobalColor');

  constructor() {
    super(new GlVertexShader(vertexShaderData), new GlFragmentShader(fragmentShaderData));
    this.use();
    gl.uniform1i(this.uTexture, 0);
  }
}
