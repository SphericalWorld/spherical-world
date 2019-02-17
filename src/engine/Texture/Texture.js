// @flow strict
import { type getElements } from '../../../common/utils/flow';
import { gl } from '../glEngine';

type TextureTarget =
  | typeof gl.TEXTURE_2D
  | typeof gl.TEXTURE_CUBE_MAP
  | typeof gl.TEXTURE_3D
  | typeof gl.TEXTURE_2D_ARRAY;

export const makeTexture = (
  textureImage: HTMLImageElement | HTMLCanvasElement,
  target: TextureTarget,
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

type TextureMeta = {|
  +overlay: boolean,
|};

export default class Texture {
  image: HTMLImageElement;
  glTexture: WebGLTexture;
  atlasId: ?number = null;
  name: string;
  target: TextureTarget = gl.TEXTURE_2D;
  meta: ?TextureMeta;
  animated: boolean = false;
  frames: number = 0;

  constructor(
    image: HTMLImageElement,
    glTexture: WebGLTexture,
    meta?: TextureMeta,
    atlasId?: number,
  ) {
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

  static makeAnimatedTexture(
    textureImage: HTMLImageElement | HTMLCanvasElement,
    target: TextureTarget,
    type: number = gl.RGBA,
  ): WebGLTexture {
    const texture: WebGLTexture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
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

  static createFromCanvas(params: {
    canvas: HTMLCanvasElement,
    name: string,
  }): Texture {
    const glTexture = makeTexture(params.canvas, gl.TEXTURE_2D);
    const texture = new this(null, glTexture);
    texture.name = params.name;
    return texture;
  }

  static async create(dataUrl: string, {
    animated = false,
    type,
    meta,
    name,
    atlasId,
  }: {
    animated?: boolean,
    type?: number,
    meta?: TextureMeta,
    name: string,
    atlasId?: number,
  }): Promise<Texture> {
    const image = await imageByDataURL(dataUrl);
    const target = animated
      ? gl.TEXTURE_2D_ARRAY
      : gl.TEXTURE_2D;

    const glTexture = animated
      ? this.makeAnimatedTexture(image, target, type)
      : makeTexture(image, target, type);
    const texture = new this(image, glTexture, meta, atlasId);
    texture.name = name;
    texture.animated = animated;
    if (animated) {
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

export type TextureImageUnit = getElements<typeof TextureImageUnits>;
