import { gl } from '../../engine/glEngine';
import {
  GlVertexShader,
  GlFragmentShader,
  GlShaderProgram,
} from '../../engine/glShader';
import type { TexturableShader } from '../TexturableShader';
import vertexShaderData from './diffuse.vert';
import fragmentShaderData from './diffuse.frag';

export default class DiffuseProgram extends GlShaderProgram
  implements TexturableShader {
  name = 'diffuse';

  attributes = ['aVertexPosition', 'aTextureCoord'];
  uniforms = ['uPMatrix', 'uMVMatrix', 'uTexture', 'uLighting', 'uGlobalColor'];

  uTexture: WebGLUniformLocation;
  uGlobalColor: WebGLUniformLocation;
  aVertexPosition = 0;
  aTextureCoord = 0;

  constructor() {
    super(
      new GlVertexShader(vertexShaderData),
      new GlFragmentShader(fragmentShaderData),
    );
    this.link();
    this.use();
    gl.uniform1i(this.uTexture, 0);
  }
}
