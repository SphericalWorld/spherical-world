import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import vertexShaderData from './skybox.vert';
import fragmentShaderData from './skybox.frag';

export default class SkyboxProgram extends GlShaderProgram {
  name = 'skybox';
  aVertexPosition = this.createAttribute('aVertexPosition');
  aTextureCoord = this.createAttribute('aTextureCoord');

  uPMatrix = this.createUniform('uPMatrix');
  uMVMatrix = this.createUniform('uMVMatrix');
  uTime = this.createUniform('uTime');
  uLighting = this.createUniform('uLighting');
  uTexture = this.createUniform('uTexture');
  uSunPosition = this.createUniform('uSunPosition');

  constructor() {
    super(new GlVertexShader(vertexShaderData), new GlFragmentShader(fragmentShaderData));
  }
}
