// @flow strict
import { type GlShaderProgram } from '../glShader';

export interface Material {
  name: ?string;
  shader: GlShaderProgram;
  transparent: boolean;

  use(): void;
}
