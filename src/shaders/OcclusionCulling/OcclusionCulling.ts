import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import vertexShaderData from './occlusionCulling.vert';
import fragmentShaderData from './occlusionCulling.frag';

export default class OcclusionCullingProgram extends GlShaderProgram {
  name = 'occlusionCulling';
  attributes = ['aVertexPosition'];
  uniforms = ['uPMatrix', 'uMVMatrix'];

  constructor() {
    super(new GlVertexShader(vertexShaderData), new GlFragmentShader(fragmentShaderData));
    this.link();
  }
}
