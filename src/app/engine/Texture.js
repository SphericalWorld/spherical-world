// @flow
import { gl } from './glEngine';

export const makeTexture = (
  textureImage: HTMLImageElement | HTMLCanvasElement,
  target: number,
  type: number = gl.RGBA,
): WebGLTexture => {
  const texture: WebGLTexture = gl.createTexture();
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(target, texture);
  gl.texImage2D(target, 0, type, type, gl.UNSIGNED_BYTE, textureImage);
  gl.generateMipmap(target);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.bindTexture(target, null);
  return texture;
};

const imageByDataURL = async (src: string): Promise<HTMLImageElement> => {
  const img = new Image();
  return new Promise((resolve) => {
    img.onload = () => {
      window.URL.revokeObjectURL(src);
      resolve(img);
    };
    img.src = src;
  });
};

export default class Texture {
  image: HTMLImageElement;
  glTexture: WebGLTexture;
  atlasId: ?number = null;
  name: string;
  target: number;
  meta: ?Object;
  animated: boolean = false;
  frames: number = 0;

  constructor(image: HTMLImageElement, glTexture: WebGLTexture, meta?: Object, atlasId?: number) {
    this.image = image;
    this.glTexture = glTexture;
    if (typeof atlasId === 'number') {
      this.atlasId = atlasId;
    }
    this.meta = meta;
  }

  use(): void {
    gl.bindTexture(this.target, this.glTexture);
  }

  static makeAnimatedTexture(textureImage: HTMLImageElement | HTMLCanvasElement, target: number, type: number = gl.RGBA): WebGLTexture {
    const texture: WebGLTexture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.bindTexture(target, texture);
    // console.log(textureImage)
    gl.texImage3D(
      target,
      0,
      type,
      textureImage.width,
      textureImage.width,
      textureImage.height / textureImage.width,
      0,
      type,
      gl.UNSIGNED_BYTE,
      textureImage,
    );
    gl.generateMipmap(target);
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(target, null);
    return texture;
  }

  static createFromCanvas(params: Object): Texture {
    const glTexture = makeTexture(params.canvas, gl.TEXTURE_2D, params.type);
    const texture = new this(null, glTexture, params.atlasId);
    texture.name = params.name;
    return texture;
  }

  static async create(dataUrl: string, params: Object): Promise<Texture> {
    const image = await imageByDataURL(dataUrl);
    const target = params.animated
      ? gl.TEXTURE_2D_ARRAY
      : gl.TEXTURE_2D;

    const glTexture = params.animated
      ? this.makeAnimatedTexture(image, target, params.type)
      : makeTexture(image, target, params.type);
    const texture = new this(image, glTexture, params.meta, params.atlasId);
    texture.name = params.name;
    texture.animated = params.animated;
    if (params.animated) {
      texture.frames = image.height / image.width;
    }
    texture.target = target;
    return texture;
  }
}
