import { mat4, vec3 } from 'gl-matrix';
import { gl } from '../engine/glEngine';
import { materialLibrary, GlObject } from '../engine';
import { createModelFromBlock } from '../engine/Model/ModelFromBlock';
import { imageFromTexture } from '../engine/Texture/TextureLibrary';
import { blocksInfo, blocksTextureInfo } from './blocksInfoAllThreads';
import type { BlockData } from './Block';
import type Model from '../engine/Model';

export const generateBlockModels = () => {
  console.time('blocks=');

  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.clearColor(1, 1, 1, 0);
  const textureSize = 128;
  gl.canvas.width = textureSize;
  gl.canvas.height = textureSize;

  const targetTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, targetTexture);
  gl.viewport(0, 0, textureSize, textureSize);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    textureSize,
    textureSize,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);
  gl.bindTexture(gl.TEXTURE_2D, null);

  const mvMatrix = mat4.create();
  const pMatrix = mat4.create();

  mat4.ortho(pMatrix, -0.85, 0.85, -0.85, 0.85, -0.85, 5.0);
  mat4.lookAt(
    mvMatrix,
    vec3.fromValues(1, 1, 1),
    vec3.fromValues(-1, -1, -1),
    vec3.fromValues(0, -1, 0),
  );
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  const pixels = new Uint8ClampedArray(textureSize * textureSize * 4);
  const material123 = materialLibrary.get('blocksInventory');
  gl.useProgram(material123.shader.program);
  material123.use();

  gl.uniformMatrix4fv(material123.shader.uPMatrix, false, pMatrix);
  gl.uniformMatrix4fv(material123.shader.uMVMatrix, false, mvMatrix);

  const material = materialLibrary.get('blocksDropable');

  for (const block of blocksInfo) {
    if (block && block.model) {
      block.asItem = createModelFromBlock(block.model);
      block.asItem.createVBO(material);
      const object = new GlObject({ model: block.asItem, material: material123 });
      object.draw();

      gl.readPixels(0, 0, textureSize, textureSize, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      const itemImage = imageFromTexture(pixels, textureSize, textureSize);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      block.itemImage = itemImage;
    }
  }
  gl.useProgram(null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(fb);
  gl.deleteTexture(targetTexture);

  console.timeEnd('blocks=');
};

type BlockDataMainThread = SpreadTypes<BlockData, { itemImage: string; asItem: Model }>;

const qwe = blocksInfo as BlockDataMainThread[];

export { blocksTextureInfo, qwe as blocksInfo };
