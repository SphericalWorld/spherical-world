import type { GlShaderProgram } from './glShader';

export class ShaderLibrary<TShader extends GlShaderProgram = GlShaderProgram> {
  shaders: Map<string, TShader> = new Map();

  get(name: string): TShader {
    const shader = this.shaders.get(name);
    if (!shader) {
      throw Error(`Shader ${name} is not registered`);
    }
    return shader;
  }

  add(...shaders: TShader[]): this {
    for (const shader of shaders) {
      this.shaders.set(shader.name, shader);
    }
    return this;
  }
}
