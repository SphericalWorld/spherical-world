// @flow strict
import { GlShaderProgram } from './glShader';

export class ShaderLibrary {
  shaders: Map<string, GlShaderProgram> = new Map();

  get(name: string): GlShaderProgram {
    const shader = this.shaders.get(name);
    if (!shader) {
      throw Error(`Shader ${name} is not registered`);
    }
    return shader;
  }

  add(...shaders: GlShaderProgram[]): this {
    for (const shader of shaders) {
      this.shaders.set(shader.name, shader);
    }
    return this;
  }
}
