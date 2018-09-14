// @flow
import type { GlShaderProgram } from '../glShader';

export interface Material {
  name: string;
  shader: GlShaderProgram;

  use(): void;
}
