// @flow
import { gl } from './glEngine';
import Texture, { makeTexture } from './Texture';

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
  if (center) {
    x -= width / 2;
    y -= height / 2;
  }

  context.translate(x + (width / 2), y + (height / 2));
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
    this.textureCanvas = (document.getElementById('texture-canvas'): HTMLCanvasElement);
    this.ctx = this.textureCanvas.getContext('2d');

    this.animTexCount = 0;
    for (const texture of this.textures.values()) {
      if (texture.animation && texture.animation.atlas) {
        this.animTexCount++;
      }
    }
  }

  makeTextureFromText(textToWrite: string, textSize: number = 56) {
    this.ctx.font = `bold ${textSize}px monospace`;
    this.textureCanvas.width = Math.pow(2, Math.ceil(Math.log(this.ctx.measureText(textToWrite).width) / Math.log(2)));
    this.textureCanvas.height = Math.pow(2, Math.ceil(Math.log(2 * textSize) / Math.log(2)));
    (this.textureCanvas.width > this.textureCanvas.height) ? this.textureCanvas.height = this.textureCanvas.width : this.textureCanvas.width = this.textureCanvas.height;
    this.ctx.fillStyle = '#FFF0';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = '#FFF';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = `bold ${textSize}px monospace`;
    this.ctx.fillText(textToWrite, this.textureCanvas.width / 2, this.textureCanvas.height / 2);
    return makeTexture(this.textureCanvas, gl.TEXTURE_2D, 'RGBA');
  }

  makeTextureAtlas(): Texture {
    const tileSize = 64;
    this.textureCanvas.width = 1024;
    this.textureCanvas.height = 1024;
    this.ctx.fillStyle = '#FFF0';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (const texture of this.textures.values()) {
      if (typeof texture.atlasId === 'number') {
        drawImage(this.ctx, texture.image, ((texture.atlasId % 16) * tileSize), tileSize * (Math.floor(texture.atlasId / 16)), 64, 64, 0, false, true);
      }
    }
    return Texture.createFromCanvas({ canvas: this.textureCanvas, name: 'terrain' });
  }

  makeTextureAtlasOverlay(): Texture {
    const tileSize = 64;
    this.textureCanvas.width = 1024;
    this.textureCanvas.height = 1024;
    this.ctx.fillStyle = '#FFF0';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (const texture of this.textures.values()) {
      if (typeof texture.atlasId === 'number' && texture.meta && texture.meta.overlay) {
        console.log(1231234);
        drawImage(this.ctx, texture.image, ((texture.atlasId % 16) * tileSize), tileSize * (Math.floor(texture.atlasId / 16)), 64, 64, 0, false, true);
      }
    }
    return Texture.createFromCanvas({ canvas: this.textureCanvas, name: 'terrainOverlay' });
  }

  makeChunkMinimap(data) {
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
    this.textureCanvas.width = 16 * terrain.size;
    this.textureCanvas.height = 16 * terrain.size;
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
    for (const i in this.textures) {
      if (typeof (this.textures[i].id) !== 'undefined') {
        this.ctx.drawImage(this.textures[i].textureImage, ((this.textures[i].id % 16)), (Math.floor(this.textures[i].id / 16)), 1, 1);
      }
    }
    const pixelData = this.ctx.getImageData(0, 0, 16, 16);
    const atlas = [];
    for (let i = 0; i < pixelData.data.length / 4; i++) {
      atlas.push([pixelData.data[i * 4], pixelData.data[i * 4 + 1], pixelData.data[i * 4 + 2]]);
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
    for (const i in this.textures) {
      if (this.textures[i].animation && (this.textures[i].textureImage.height > this.textures[i].textureImage.width)) {
        animTextures.push(this.textures[i]);

        this.ctx.drawImage(this.textures[i].textureImage, 0, 0);
        const tex = makeTexture(this.textureCanvas, gl.TEXTURE_2D, 'RGBA');

        // console.log(this.textureCanvas.toDataURL())
        atlas.textures.push(tex);
      }
    }
    console.log(atlas);

    // terrainAnimated
    return atlas;
  }

  get(textureName: string): Texture {
    return this.textures.get(textureName);
  }

  add(...textures: Texture[]) {
    for (const texture of textures) {
      this.textures.set(texture.name, texture);
    }
  }
}

export default GlTextureLibrary;
