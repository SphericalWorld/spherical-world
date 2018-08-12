// @flow
import Material from './Material';

const materialLibraryProvider = () => {
  class MaterialLibrary {
    materials: Map<string, Material> = new Map();

    get(materialName: string): ?Material {
      return this.materials.get(materialName);
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
