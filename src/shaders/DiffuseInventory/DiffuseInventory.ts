import { gl } from '../../engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import type { TexturableShader } from '../TexturableShader';
import vertexShaderData from './diffuseInventory.vert';
import fragmentShaderData from './diffuseInventory.frag';

export default class DiffuseInventoryProgram extends GlShaderProgram implements TexturableShader {
  name = 'diffuseInventory';

  attributes = ['aVertexPosition', 'aTextureCoord'];
  uniforms = ['uPMatrix', 'uMVMatrix', 'uTexture'];

  uTexture: WebGLUniformLocation;
  aVertexPosition = 0;
  aTextureCoord = 0;

  constructor() {
    super(new GlVertexShader(vertexShaderData), new GlFragmentShader(fragmentShaderData));
    this.link();
    this.use();
    gl.uniform1i(this.uTexture, 0);
  }
}
