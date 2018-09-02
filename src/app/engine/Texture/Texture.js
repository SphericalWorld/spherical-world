// @flow
import { gl } from '../glEngine';

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
  target: number = gl.TEXTURE_2D;
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

export const TextureImageUnits = [
  gl.TEXTURE0,
  gl.TEXTURE1,
  gl.TEXTURE2,
  gl.TEXTURE3,
  gl.TEXTURE4,
  gl.TEXTURE5,
  gl.TEXTURE6,
  gl.TEXTURE7,
  gl.TEXTURE8,
  gl.TEXTURE9,
  gl.TEXTURE10,
  gl.TEXTURE11,
  gl.TEXTURE12,
  gl.TEXTURE13,
  gl.TEXTURE14,
  gl.TEXTURE15,
  gl.TEXTURE16,
  gl.TEXTURE17,
  gl.TEXTURE18,
  gl.TEXTURE19,
  gl.TEXTURE20,
  gl.TEXTURE21,
  gl.TEXTURE22,
  gl.TEXTURE23,
  gl.TEXTURE24,
  gl.TEXTURE25,
  gl.TEXTURE26,
  gl.TEXTURE27,
  gl.TEXTURE28,
  gl.TEXTURE29,
  gl.TEXTURE30,
  gl.TEXTURE31,
];

type getElements = <T>(val: T[]) => T;

export type TextureImageUnit = $Call<getElements, typeof TextureImageUnits>;
