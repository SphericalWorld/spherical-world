import type { GlShaderProgram } from '../glShader';
import type { Material } from './Material';
import type { TextureImageUnit } from '../Texture/Texture';
import { TextureImageUnits } from '../Texture/Texture';

import { gl } from '../glEngine';

type Layer = Readonly<{
  material: Material;
  unit: TextureImageUnit;
}>;

export default class MultiMaterial implements Material {
  layers: Layer[] = [];
  name: string | null;
  shader: GlShaderProgram;
  transparent = false;

  constructor({
    name,
    layers,
    shader,
  }: {
    name: string;
    shader: GlShaderProgram;
    layers: Material[];
  }) {
    this.name = name;
    this.shader = shader;
    this.layers = layers.map((material, index) => ({
      material,
      unit: TextureImageUnits[index],
    }));
  }

  use() {
    for (let i = 0; i < this.layers.length; i += 1) {
      gl.activeTexture(this.layers[i].unit);
      this.layers[i].material.use();
    }
  }
}
