import { gl } from '../../engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import vertexShaderData from './chunk.vert';
import fragmentShaderData from './chunk.frag';

export default class ChunkProgram extends GlShaderProgram {
  name = 'chunk';

  attributes = ['aVertexPosition', 'aTextureCoord', 'aVertexColor', 'aVertexGlobalColor', 'aBlockData'];
  uniforms = ['uPMatrix', 'uMVMatrix', 'uBlocksTexture', 'uGrassColorMapTexture', 'uBlocksOverlayTexture', 'uAnimationTexture', 'uGlobalColor', 'uBufferNum', 'uTime', 'uFogColor', 'uFogDensity', 'uFogType', 'uAnimTextures'];

  aVertexPosition: number = 0;
  aTextureCoord: number = 0;
  aVertexColor: number = 0;
  aVertexGlobalColor: number = 0;
  aBlockData: number = 0;

  uPMatrix: WebGLUniformLocation;
  uMVMatrix: WebGLUniformLocation;
  uBlocksTexture: WebGLUniformLocation;
  uGrassColorMapTexture: WebGLUniformLocation;
  uBlocksOverlayTexture: WebGLUniformLocation;
  uAnimationTexture: WebGLUniformLocation;
  uGlobalColor: WebGLUniformLocation;
  uBufferNum: WebGLUniformLocation;
  uTime: WebGLUniformLocation;
  uFogColor: WebGLUniformLocation;
  uFogDensity: WebGLUniformLocation;
  uFogType: WebGLUniformLocation;
  uAnimTextures: WebGLUniformLocation;

  constructor() {
    super(new GlVertexShader(vertexShaderData, {
      constants: {
        animTexCount: 1, // app.glTextureLibrary.animTexCount,
        GRAPHIC_LEVEL_CURRENT: 1,
        GRAPHIC_LEVEL_SIMPLE: 1,
        GRAPHIC_LEVEL_ADVANCED: 2,
        GRAPHIC_LEVEL_HIGH: 3,
        GRAPHIC_LEVEL_ULTRA: 4,
      },
    }), new GlFragmentShader(fragmentShaderData, {
      constants: {
        GRAPHIC_LEVEL_CURRENT: 1,
        GRAPHIC_LEVEL_SIMPLE: 1,
        GRAPHIC_LEVEL_ADVANCED: 2,
        GRAPHIC_LEVEL_HIGH: 3,
        GRAPHIC_LEVEL_ULTRA: 4,
      },
    }));
    this.link();
    this.use();

    gl.uniform1i(this.uBlocksTexture, 0);
    gl.uniform1i(this.uBlocksOverlayTexture, 1);
    gl.uniform1i(this.uAnimationTexture, 2);
    gl.uniform1i(this.uGrassColorMapTexture, 3);
  }
}
