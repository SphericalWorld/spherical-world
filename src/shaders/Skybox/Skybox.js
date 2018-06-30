// @flow
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../app/engine/glShader';
import vertexShaderData from './skybox.vert';
import fragmentShaderData from './skybox.frag';

export default class SkyboxProgram extends GlShaderProgram {
  name = 'skybox';
  vertexShader = new GlVertexShader(vertexShaderData);
  fragmentShader = new GlFragmentShader(fragmentShaderData);

  attributes = ['aVertexPosition'];
  uniforms = ['uPMatrix', 'uMVMatrix', 'time', 'uLighting', 'uSunPosition'];

  constructor() {
    super();
    this.link();
  }
}
