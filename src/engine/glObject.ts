import type { Material } from './Material/Material';
import type Model from './Model';

type Options = Readonly<{
  model: Model;
  material: Material;
}>;

class GlObject {
  material: Material;
  model: Model;

  constructor({ model, material }: Options = {}) {
    this.model = model;
    if (!material) {
      throw new Error('Material should be provided for GlObject');
    }
    this.material = material;
    this.color = [1, 1, 1];
    if (model) {
      model.createVBO(this.material);
    }
  }

  draw(): void {
    this.model.draw(this.material.shader);
  }
}

export default GlObject;
