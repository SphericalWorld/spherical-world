import type { Material } from './Material';
import { gl } from '../glEngine';
import Texture from '../Texture/Texture';
import { GlShaderProgram } from '../glShader';

export const BLENDING_OPAQUE: 0 = 0;
export const BLENDING_TRANSPARENT: 1 = 1;
export const BLENDING_MASKED: 2 = 2;
export const BLENDING_TRANSLUCENT: 3 = 3;
export const BLENDING_ADDITIVE: 4 = 4;
export const BLENDING_MODULATE: 5 = 5;

type BlendingMode =
  | typeof BLENDING_OPAQUE
  | typeof BLENDING_TRANSPARENT
  | typeof BLENDING_MASKED
  | typeof BLENDING_TRANSLUCENT
  | typeof BLENDING_ADDITIVE
  | typeof BLENDING_MODULATE;

type MaterialOptions = {
  name?: string,
  diffuse?: Texture,
  blendingMode?: BlendingMode,
  shader: GlShaderProgram,
};

export class SimpleMaterial implements Material {
  diffuse: Texture;
  name: string | null;
  blendingMode: BlendingMode;
  shader: GlShaderProgram;
  transparent = false;
  frame = 0;

  constructor({
    name,
    diffuse,
    blendingMode = BLENDING_OPAQUE,
    shader,
  }: MaterialOptions) {
    this.blendingMode = blendingMode;
    this.transparent = blendingMode !== BLENDING_OPAQUE;
    this.name = name !== '' ? name : null;
    if (diffuse) {
      this.diffuse = diffuse;
    }
    this.shader = shader;
  }

  use(): void {
    if (this.diffuse) {
      this.diffuse.use();
      if (this.diffuse.animated) {
        this.shader.animate(this.frame % this.diffuse.frames);
      }
    }
    if (this.blendingMode === BLENDING_ADDITIVE) {
      gl.enable(gl.BLEND);
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendFunc(gl.DST_COLOR, gl.SRC_COLOR);
      // gl.disable(gl.BLEND);
    }
    if (this.blendingMode === BLENDING_TRANSPARENT) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      // gl.disable(gl.BLEND);
    }
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
}
