import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import vertexShaderData from './occlusionCulling.vert';
import fragmentShaderData from './occlusionCulling.frag';

export default class OcclusionCullingProgram extends GlShaderProgram {
  name = 'occlusionCulling';
  aTextureCoord = this.createAttribute('aVertexPosition');
  uPMatrix = this.createUniform('uPMatrix');
  uMVMatrix = this.createUniform('uMVMatrix');

  constructor() {
    super(new GlVertexShader(vertexShaderData), new GlFragmentShader(fragmentShaderData));
    this.use();
  }
}
