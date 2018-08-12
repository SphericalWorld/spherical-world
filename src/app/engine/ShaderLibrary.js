// @flow
import { GlShaderProgram } from './glShader';

const shaderLibraryProvider = () => {
  class ShaderLibrary {
    shaders: Map<string, GlShaderProgram> = new Map();

    get(name: string): ?GlShaderProgram {
      return this.shaders.get(name);
    }

    add(...shaders: GlShaderProgram[]): this {
      for (const shader of shaders) {
        this.shaders.set(shader.name, shader);
      }
      return this;
    }
  }
  return ShaderLibrary;
};

declare var tmp: $Call<typeof shaderLibraryProvider>;
export type ShaderLibrary = tmp;

export default shaderLibraryProvider;
