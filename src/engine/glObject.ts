import type { Material } from './Material/Material';
import Model from './Model';

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

  draw() {
    // gl.uniform3f(this.app.currentShader.uLighting, this.color[0], this.color[1], this.color[2]);
    // mat4.translate(this.app.mvMatrix, this.app.mvMatrix, [this.x, this.y, this.z]);
    // mat4.rotateY(this.app.mvMatrix, this.app.mvMatrix, this.horizontalRotate);
    this.model.draw(this.material.shader);
  }
}

export default GlObject;
