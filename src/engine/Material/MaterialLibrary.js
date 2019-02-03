// @flow strict
import { type Material } from './Material';

const materialLibraryProvider = () => {
  class MaterialLibrary {
    materials: Map<string, Material> = new Map();

    get(materialName: string): Material {
      const material = this.materials.get(materialName);
      if (!material) {
        throw Error(`Material ${materialName} is not registered`);
      }
      return material;
    }

    add(...materials: Material[]): this {
      for (const material of materials) {
        this.materials.set(material.name, material);
      }
      return this;
    }
  }
  return MaterialLibrary;
};

declare var tmp: $Call<typeof materialLibraryProvider>;
export type MaterialLibrary = tmp;

export default materialLibraryProvider;
