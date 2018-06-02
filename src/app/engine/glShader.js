// @flow
import { gl } from './glEngine';

class GlShader {
  source: string;
  type: number;
  shader: WebGLShader;
  version: string = '300';

  constructor(source: string, constants) {
    this.source = source;
    this.shader = null;
    this.setConstants(constants);
  }

  setConstants(constants) {
    for (const i in constants) {
      this.source = `#define ${i} ${constants[i]} \n${this.source}`;
    }
    this.source = `#version ${this.version} es\n${this.source}`;
  }

  compile() {
    this.shader = gl.createShader(this.type);
    gl.shaderSource(this.shader, this.source);
    gl.compileShader(this.shader);
    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
      throw new Error(`Shader compilation error: ${gl.getShaderInfoLog(this.shader)}`);
    }
  }
}

class GlVertexShader extends GlShader {
  type = gl.VERTEX_SHADER;
  constructor(source: string, { constants = {} } = {}) {
    super(source, constants);
    this.compile();
  }
}

class GlFragmentShader extends GlShader {
  type = gl.FRAGMENT_SHADER;
  constructor(source: string, { constants = {} } = {}) {
    super(source, constants);
    this.compile();
  }
}

class GlShaderProgram {
  name: string;
  attributes: string[];
  uniforms: string[];
  vertexShader: GlVertexShader;
  fragmentShader: GlFragmentShader;
  program: WebGLProgram;

  constructor() {
    this.program = gl.createProgram();
  }

  async load() {
    this.link();
    for (const attribute of this.attributes) {
      this.setAttribLocation.call(this, attribute);
    }
    for (const uniform of this.uniforms) {
      this.setUniformLocation.call(this, uniform);
    }
  }

  link() {
    gl.attachShader(this.program, this.vertexShader.shader);
    gl.attachShader(this.program, this.fragmentShader.shader);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error('Shader linking error');
    }
    for (const attribute of this.attributes) {
      this.setAttribLocation(attribute);
    }
    for (const uniform of this.uniforms) {
      this.setUniformLocation(uniform);
    }
  }

  setAttribLocation(attribName: string): void {
    this[attribName] = gl.getAttribLocation(this.program, attribName);
    gl.enableVertexAttribArray(this[attribName]);
  }

  setUniformLocation(attribName: string): void {
    this[attribName] = gl.getUniformLocation(this.program, attribName);
  }

  use(): void {
    gl.useProgram(this.program);
  }
}

export { GlVertexShader, GlFragmentShader, GlShaderProgram };
