// @flow strict
import { gl } from '../glEngine';
import Texture, { makeTexture } from './Texture';
import { CHUNK_WIDTH, TERRAIN_SIZE } from '../../../common/constants/chunk';

const TILE_SIZE = 64;

const drawImage = (
  context: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width?: number = img.width,
  height?: number = img.height,
  deg: number,
  flip: boolean,
  flop: boolean,
  center?: boolean = false,
) => {
  context.save();
  if (!center) {
    context.translate(x + (width / 2), y + (height / 2));
  }

  context.rotate((2 * Math.PI) - ((deg * Math.PI) / 180));
  const flipScale = flip ? -1 : 1;
  const flopScale = flop ? -1 : 1;

  context.scale(flipScale, flopScale);
  context.drawImage(img, -width / 2, -height / 2, width, height);
  context.restore();
};

class GlTextureLibrary {
  textures: Map<string, Texture> = new Map();
  textureCanvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() {
    const textureCanvas = document.getElementById('texture-canvas');
    if (!(textureCanvas instanceof HTMLCanvasElement)) {
      throw new Error('Fatal error: texture canvas not found');
    }
    this.textureCanvas = textureCanvas;
    this.ctx = this.textureCanvas.getContext('2d');
  }

  makeTextureFromText(textToWrite: string, textSize: number = 56) {
    this.ctx.font = `bold ${textSize}px monospace`;
    this.textureCanvas.width = 2 ** Math.ceil(Math.log2(this.ctx.measureText(textToWrite).width));
    this.textureCanvas.height = 2 ** Math.ceil(Math.log2(2 * textSize));
    if (this.textureCanvas.width > this.textureCanvas.height) {
      this.textureCanvas.height = this.textureCanvas.width;
    } else {
      this.textureCanvas.width = this.textureCanvas.height;
    }
    this.ctx.translate(this.textureCanvas.width / 2, this.textureCanvas.height / 2);
    this.ctx.rotate((2 * Math.PI) - ((180 * Math.PI) / 180));
    this.ctx.scale(-1, 1);

    this.ctx.translate(-this.textureCanvas.width / 2, -this.textureCanvas.height / 2);

    this.ctx.fillStyle = '#FFF0';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = '#FFF';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = `bold ${textSize}px monospace`;

    this.ctx.fillText(textToWrite, this.textureCanvas.width / 2, this.textureCanvas.height / 2);

    return new Texture(null, makeTexture(this.textureCanvas, gl.TEXTURE_2D, gl.RGBA));
  }

  makeTextureAtlasBase(name: string, predicate: (Texture) => boolean): Texture {
    this.textureCanvas.width = 1024;
    this.textureCanvas.height = 1024;
    this.ctx.fillStyle = '#FFF0';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (const texture of this.textures.values()) {
      if (typeof texture.atlasId === 'number' && predicate(texture)) {
        drawImage(
          this.ctx,
          texture.image,
          ((texture.atlasId % 16) * TILE_SIZE),
          TILE_SIZE * (Math.floor(texture.atlasId / 16)),
          TILE_SIZE,
          TILE_SIZE,
          0,
          false,
          true,
        );
      }
    }
    return Texture.createFromCanvas({ canvas: this.textureCanvas, name });
  }

  makeTextureAtlas(): Texture {
    return this.makeTextureAtlasBase('terrain', () => true);
  }

  makeTextureAtlasOverlay(): Texture {
    return this.makeTextureAtlasBase('terrainOverlay', texture => (texture.meta && texture.meta.overlay) || false);
  }

  makeChunkMinimap(data: Uint8Array): ImageData {
    this.textureCanvas.width = 16;
    this.textureCanvas.height = 16;

    const imgData = this.ctx.createImageData(16, 16);

    for (let i = 0; i < 256; i += 1) {
      imgData.data[i * 4] = data[i * 3];
      imgData.data[(i * 4) + 1] = data[(i * 3) + 1];
      imgData.data[(i * 4) + 2] = data[(i * 3) + 2];
      imgData.data[(i * 4) + 3] = 255;
    }

    // this.ctx.putImageData(imgData, 0, 0);

    return imgData;
  }

  makeTerrainMinimap(terrain) {
    this.textureCanvas.width = CHUNK_WIDTH * TERRAIN_SIZE;
    this.textureCanvas.height = CHUNK_WIDTH * TERRAIN_SIZE;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (const chunk of terrain.chunks.values()) {
      if (chunk.minimap instanceof ImageData) {
        this.ctx.putImageData(chunk.minimap, chunk.x, chunk.z);
      }
    }
    return this.textureCanvas.toDataURL();
  }

  makeMipMappedTextureAtlas() {
    this.textureCanvas.width = 16;
    this.textureCanvas.height = 16;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (const texture of this.textures.values()) {
      if (typeof texture.id !== 'undefined') {
        this.ctx.drawImage(
          texture.image,
          ((texture.id % 16)),
          (Math.floor(texture.id / 16)),
          1,
          1,
        );
      }
    }
    const pixelData = this.ctx.getImageData(0, 0, 16, 16);
    const atlas = [];
    for (let i = 0; i < pixelData.data.length / 4; i += 1) {
      atlas.push([pixelData.data[i * 4], pixelData.data[(i * 4) + 1], pixelData.data[(i * 4) + 2]]);
    }
    // atlas.reverse();
    // console.log(atlas)
    return atlas;
  }

  makeAnimatedTextureAtlas() {
    const atlas = {
      textures: [],
      animations: {

      },
    };

    this.textureCanvas.width = 1024;
    this.textureCanvas.height = 1024;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // console.log(this.textureCanvas.toDataURL())


    const animTextures = [];
    for (const texture of this.textures.values()) {
      if (texture.animation && (texture.image.height > texture.image.width)) {
        animTextures.push(texture);

        this.ctx.drawImage(texture.image, 0, 0);
        const tex = makeTexture(this.textureCanvas, gl.TEXTURE_2D, gl.RGBA);

        // console.log(this.textureCanvas.toDataURL())
        atlas.textures.push(tex);
      }
    }
    console.log(atlas);

    return Texture.createFromCanvas({ canvas: this.textureCanvas, name: 'animatedTexture' });
    // terrainAnimated
    // return atlas;
  }

  get(textureName: string): Texture {
    const texture = this.textures.get(textureName);
    if (!texture) {
      throw Error(`Texture ${textureName} is not registered`);
    }
    return texture;
  }

  add(...textures: Texture[]): this {
    for (const texture of textures) {
      this.textures.set(texture.name, texture);
    }
    return this;
  }
}

export default GlTextureLibrary;
