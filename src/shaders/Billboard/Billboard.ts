import { gl } from '../../engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import vertexShaderData from './billboard.vert';
import fragmentShaderData from './billboard.frag';

export default class BillboardProgram extends GlShaderProgram {
  name = 'billboard';

  aVertexPosition = this.createAttribute('aVertexPosition');
  aTextureCoord = this.createAttribute('aTextureCoord');

  uPMatrix = this.createUniform('uPMatrix');
  uMVMatrix = this.createUniform('uMVMatrix');
  uLighting = this.createUniform('uLighting');
  uTexture = this.createUniform('uTexture');

  constructor() {
    super(new GlVertexShader(vertexShaderData), new GlFragmentShader(fragmentShaderData));
    this.use();
    gl.uniform1i(this.uTexture, 0);
  }
}

export const billboard = new BillboardProgram();
