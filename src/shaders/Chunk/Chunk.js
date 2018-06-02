// @flow
import { gl } from '../../app/engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../app/engine/glShader';
import vertexShaderData from './chunk.vert';
import fragmentShaderData from './chunk.frag';

export default class ChunkProgram extends GlShaderProgram {
  name = 'chunk';
  vertexShader = new GlVertexShader(vertexShaderData, {
    constants: {
      animTexCount: 1, // app.glTextureLibrary.animTexCount,
      GRAPHIC_LEVEL_CURRENT: 1,
      GRAPHIC_LEVEL_SIMPLE: 1,
      GRAPHIC_LEVEL_ADVANCED: 2,
      GRAPHIC_LEVEL_HIGH: 3,
      GRAPHIC_LEVEL_ULTRA: 4,
    },
  });
  fragmentShader = new GlFragmentShader(fragmentShaderData, {
    constants: {
      GRAPHIC_LEVEL_CURRENT: 1,
      GRAPHIC_LEVEL_SIMPLE: 1,
      GRAPHIC_LEVEL_ADVANCED: 2,
      GRAPHIC_LEVEL_HIGH: 3,
      GRAPHIC_LEVEL_ULTRA: 4,
    },
  });

  attributes = ['aVertexPosition', 'aTextureCoord', 'aVertexColor', 'aVertexGlobalColor', 'aBlockData'];
  uniforms = ['uPMatrix', 'uMVMatrix', 'uBlocksTexture', 'uGrassColorMapTexture', 'uBlocksOverlayTexture', 'uAnimationTexture', 'uGlobalColor', 'uBufferNum', 'uTime', 'uFogColor', 'uFogDensity', 'uFogType', 'uAnimTextures'];

  constructor() {
    super();
    this.link();
    this.use();

    gl.uniform1i(this.uBlocksTexture, 0);
    gl.uniform1i(this.uGrassColorMapTexture, 1);
    gl.uniform1i(this.uBlocksOverlayTexture, 2);
    gl.uniform1i(this.uAnimationTexture, 3);
  }
}
