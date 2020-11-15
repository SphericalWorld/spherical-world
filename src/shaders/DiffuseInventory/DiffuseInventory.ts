import { gl } from '../../engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import type { TexturableShader } from '../TexturableShader';
import vertexShaderData from './diffuseInventory.vert';
import fragmentShaderData from './diffuseInventory.frag';

export default class DiffuseInventoryProgram extends GlShaderProgram implements TexturableShader {
  name = 'diffuseInventory';

  aVertexPosition = this.createAttribute('aVertexPosition');
  aTextureCoord = this.createAttribute('aTextureCoord');

  uPMatrix = this.createUniform('uPMatrix');
  uMVMatrix = this.createUniform('uMVMatrix');
  uTexture = this.createUniform('uTexture');

  constructor() {
    super(new GlVertexShader(vertexShaderData), new GlFragmentShader(fragmentShaderData));
    this.use();
    gl.uniform1i(this.uTexture, 0);
  }
}
