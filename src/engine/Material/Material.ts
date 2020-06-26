import type { GlShaderProgram } from '../glShader';

export interface Material {
  name: string | null;
  shader: GlShaderProgram;
  transparent: boolean;

  use(): void;
}
