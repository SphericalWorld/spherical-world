import { gl } from '../../engine/glEngine';
import { GlVertexShader, GlFragmentShader, GlShaderProgram } from '../../engine/glShader';
import vertexShaderData from './chunk.vert';
import fragmentShaderData from './chunk.frag';

export default class ChunkProgram extends GlShaderProgram {
  name = 'chunk';

  aVertexPosition = this.createAttribute('aVertexPosition');
  aTextureCoord = this.createAttribute('aTextureCoord');
  aVertexColor = this.createAttribute('aVertexColor');
  aVertexGlobalColor = this.createAttribute('aVertexGlobalColor');
  aBlockData = this.createAttribute('aBlockData');

  uPMatrix = this.createUniform('uPMatrix');
  uMVMatrix = this.createUniform('uMVMatrix');
  uBlocksTexture = this.createUniform('uBlocksTexture');
  uGrassColorMapTexture = this.createUniform('uGrassColorMapTexture');
  uBlocksOverlayTexture = this.createUniform('uBlocksOverlayTexture');
  uAnimationTexture = this.createUniform('uAnimationTexture');
  uGlobalColor = this.createUniform('uGlobalColor');
  uBufferNum = this.createUniform('uBufferNum');
  uTime = this.createUniform('uTime');
  uFogColor = this.createUniform('uFogColor');
  uFogDensity = this.createUniform('uFogDensity');
  uFogType = this.createUniform('uFogType');
  uAnimTextures = this.createUniform('uAnimTextures');

  constructor() {
    super(
      new GlVertexShader(vertexShaderData, {
        constants: {
          animTexCount: 1, // app.glTextureLibrary.animTexCount,
          GRAPHIC_LEVEL_CURRENT: 1,
          GRAPHIC_LEVEL_SIMPLE: 1,
          GRAPHIC_LEVEL_ADVANCED: 2,
          GRAPHIC_LEVEL_HIGH: 3,
          GRAPHIC_LEVEL_ULTRA: 4,
        },
      }),
      new GlFragmentShader(fragmentShaderData, {
        constants: {
          GRAPHIC_LEVEL_CURRENT: 1,
          GRAPHIC_LEVEL_SIMPLE: 1,
          GRAPHIC_LEVEL_ADVANCED: 2,
          GRAPHIC_LEVEL_HIGH: 3,
          GRAPHIC_LEVEL_ULTRA: 4,
        },
      }),
    );
    this.use();

    gl.uniform1i(this.uBlocksTexture, 0);
    gl.uniform1i(this.uBlocksOverlayTexture, 1);
    gl.uniform1i(this.uAnimationTexture, 2);
    gl.uniform1i(this.uGrassColorMapTexture, 3);
  }
}
