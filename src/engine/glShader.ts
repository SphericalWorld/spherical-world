import { gl, glCreateProgram, glCreateShader } from './glEngine';

type Constants = { [name: string]: string | number };

class GlShader {
  source: string;
  type: number;
  shader: WebGLShader;
  version = '300';

  constructor(source: string, constants: Constants) {
    this.source = source;
    this.shader = null;
    this.setConstants(constants);
  }

  setConstants(constants: Constants) {
    for (const [key, value] of Object.entries(constants)) {
      this.source = `#define ${key} ${String(value)} \n${this.source}`;
    }
    this.source = `#version ${this.version} es\n${this.source}`;
  }

  compile() {
    this.shader = glCreateShader(this.type);
    gl.shaderSource(this.shader, this.source);
    gl.compileShader(this.shader);
    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
      throw new Error(`Shader compilation error: ${String(gl.getShaderInfoLog(this.shader))}`);
    }
  }
}

class GlVertexShader extends GlShader {
  type = gl.VERTEX_SHADER;
  constructor(source: string, { constants = {} }: { constants?: Constants } = {}) {
    super(source, constants);
    this.compile();
  }
}

class GlFragmentShader extends GlShader {
  type = gl.FRAGMENT_SHADER;
  constructor(source: string, { constants = {} }: { constants?: Constants } = {}) {
    super(source, constants);
    this.compile();
  }
}

class GlShaderProgram {
  name: string;
  vertexShader: GlVertexShader;
  fragmentShader: GlFragmentShader;
  program: WebGLProgram;
  uPMatrix: WebGLUniformLocation;
  uMVMatrix: WebGLUniformLocation;

  constructor(vertexShader: GlVertexShader, fragmentShader: GlFragmentShader) {
    this.program = glCreateProgram();
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    gl.attachShader(this.program, this.vertexShader.shader);
    gl.attachShader(this.program, this.fragmentShader.shader);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error('Shader linking error');
    }
  }

  use(): void {
    gl.useProgram(this.program);
  }

  createUniform(uniformName: string): WebGLUniformLocation {
    return gl.getUniformLocation(this.program, uniformName);
  }

  createAttribute(attribName: string): number {
    const res = gl.getAttribLocation(this.program, attribName);
    gl.enableVertexAttribArray(res);
    return res;
  }
}

export { GlVertexShader, GlFragmentShader, GlShaderProgram };
