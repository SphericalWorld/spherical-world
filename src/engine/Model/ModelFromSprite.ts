import { gl } from '../glEngine';
import { imageToPixelArray } from '../Texture/TextureLibrary';
import type { Texture } from '../Texture';

const VERTEX_POSITION_SIZE: 3 = 3;
const TEXTURE_COORDINATES_SIZE: 2 = 2;

const defaultUV = [
  [1, 0],
  [0, 0],
  [1, 1],
  [0, 1],
] as const;

type Vec2 = readonly [number, number];
type Vec3 = readonly [number, number, number];

type Face = Readonly<{
  vertexes: readonly [Vec3, Vec3, Vec3, Vec3];
  indexes: readonly [number, number, number, number, number, number];
  uv: readonly [Vec2, Vec2, Vec2, Vec2];
}>;

type Faces = Readonly<{
  top: Readonly<Face>;
  bottom: Readonly<Face>;
  north: Readonly<Face>;
  south: Readonly<Face>;
  west: Readonly<Face>;
  east: Readonly<Face>;
}>;

const faces: Faces = {
  top: {
    vertexes: [
      [0, 1, 1],
      [0, 1, 0],
      [1, 1, 1],
      [1, 1, 0],
    ],
    indexes: [0, 3, 1, 0, 2, 3],
    uv: defaultUV,
  },
  bottom: {
    vertexes: [
      [0, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
      [1, 0, 0],
    ],
    indexes: [0, 1, 3, 0, 3, 2],
    uv: defaultUV,
  },
  north: {
    vertexes: [
      [1, 0, 1],
      [1, 0, 0],
      [1, 1, 1],
      [1, 1, 0],
    ],
    indexes: [0, 1, 3, 0, 3, 2],
    uv: defaultUV,
  },
  south: {
    vertexes: [
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 0],
      [0, 1, 1],
    ],
    indexes: [0, 1, 3, 0, 3, 2],
    uv: defaultUV,
  },
  west: {
    vertexes: [
      [1, 1, 1],
      [0, 1, 1],
      [1, 0, 1],
      [0, 0, 1],
    ],
    indexes: [0, 1, 3, 0, 3, 2],
    uv: defaultUV,
  },
  east: {
    vertexes: [
      [1, 1, 0],
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ],
    indexes: [0, 3, 1, 0, 2, 3],
    uv: defaultUV,
  },
};

const renderFace = (
  x: number,
  y: number,
  z: number,
  face: Face,
  buffers,
  vertexCount: number,
): number => {
  for (let index = 0; index < 4; index += 1) {
    const vertex = face.vertexes[index];
    buffers.vertexPositions.push(vertex[0] + x, vertex[1] + y, vertex[2] + z);
    buffers.vertexTextureCoords.push(1 - (face.uv[index][0] + z) + 1 / 16, face.uv[index][1] + x);
  }

  for (let index = 0; index < face.indexes.length; index += 1) {
    buffers.indices.push(face.indexes[index] + vertexCount);
  }

  return face.vertexes.length;
};

export class ModelFromSprite {
  vertexBuffer: WebGLBuffer = gl.createBuffer();
  indexBuffer: WebGLBuffer = gl.createBuffer();
  texCoordBuffer: WebGLBuffer = gl.createBuffer();
  elementsCount = 0;
  vao: WebGLVertexArrayObject = gl.createVertexArray();

  constructor() {}

  createVBO(material) {
    const { shader } = material as { shader: TexturableShader };
    gl.bindVertexArray(this.vao);
    gl.enableVertexAttribArray(shader.aVertexPosition);
    // if (shader.aTextureCoord) {
    gl.enableVertexAttribArray(shader.aTextureCoord);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.vertexAttribPointer(shader.aTextureCoord, TEXTURE_COORDINATES_SIZE, gl.FLOAT, false, 0, 0);
    // }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shader.aVertexPosition, VERTEX_POSITION_SIZE, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bindVertexArray(null);
  }

  draw(): void {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.elementsCount, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }

  loadFromImageData(textureData: ImageData, scale = 1, height = 1 / 16): void {
    let vertexPositions: number[] = [];
    const indices: number[] = [];
    const vertexTextureCoords: number[] = [];
    let vertexCount = 0;

    const row = textureData.width * 4;
    const column = 4;
    if (scale) {
      vertexPositions = vertexPositions.map((el) => el * scale);
    }
    const iterateTo = textureData.width * textureData.height;
    const uSize = 1 / textureData.width;
    const vSize = 1 / textureData.height;

    const faces1: Faces = {
      top: {
        ...faces.top,
        vertexes: faces.top.vertexes.map(([x, y, z]) => [
          x - 0.5,
          y * height - height / 2,
          z - 0.5,
        ]),
      },
      bottom: {
        ...faces.bottom,
        vertexes: faces.bottom.vertexes.map(([x, y, z]) => [
          x - 0.5,
          y * height - height / 2,
          z - 0.5,
        ]),
      },
      north: {
        ...faces.north,
        vertexes: faces.north.vertexes.map(([x, y, z]) => [
          x * vSize - 0.5,
          y * height - height / 2,
          z * uSize - 0.5,
        ]),
        uv: faces.north.uv.map(([x, z]) => [x * uSize, z * vSize]),
      },
      south: {
        ...faces.south,
        vertexes: faces.south.vertexes.map(([x, y, z]) => [
          x * vSize - 0.5,
          y * height - height / 2,
          z * uSize - 0.5,
        ]),
        uv: faces.south.uv.map(([x, z]) => [x * uSize, z * vSize]),
      },
      west: {
        ...faces.west,
        vertexes: faces.west.vertexes.map(([x, y, z]) => [
          x * vSize - 0.5,
          y * height - height / 2,
          z * uSize - 0.5,
        ]),
        uv: faces.west.uv.map(([x, z]) => [x * uSize, z * vSize]),
      },
      east: {
        ...faces.east,
        vertexes: faces.east.vertexes.map(([x, y, z]) => [
          x * vSize - 0.5,
          y * height - height / 2,
          z * uSize - 0.5,
        ]),
        uv: faces.east.uv.map(([x, z]) => [x * uSize, z * vSize]),
      },
    } as const;

    const buffers = {
      vertexPositions,
      vertexTextureCoords,
      indices,
    };
    for (let index = 0; index < iterateTo; index += 1) {
      if (textureData.data[index * 4 + 3]) {
        const x = 1 - (index % textureData.width) / textureData.width;
        const z = Math.floor(index / textureData.width) / textureData.height;

        if (!textureData.data[index * 4 + 3 + column]) {
          vertexCount += renderFace(z, 0, x, faces1.east, buffers, vertexCount);
        }
        if (!textureData.data[index * 4 + 3 - column]) {
          vertexCount += renderFace(z, 0, x, faces1.west, buffers, vertexCount);
        }
        if (!textureData.data[index * 4 + 3 + row]) {
          vertexCount += renderFace(z, 0, x, faces1.north, buffers, vertexCount);
        }
        if (!textureData.data[index * 4 + 3 - row]) {
          vertexCount += renderFace(z, 0, x, faces1.south, buffers, vertexCount);
        }
      }
    }

    vertexCount += renderFace(0, 0, 0, faces1.top, buffers, vertexCount);

    vertexCount += renderFace(0, 0, 0, faces1.bottom, buffers, vertexCount);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    this.elementsCount = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
  }
}

export const createModelFromSprite = (texture: Texture): ModelFromSprite => {
  const textureData = imageToPixelArray(texture.image);
  const model = new ModelFromSprite();
  model.loadFromImageData(textureData);

  return model;
};
