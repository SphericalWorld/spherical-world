// @flow
const PI2 = Math.PI * 2;

class Vector {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  negative(): Vector {
    return new Vector(-this.x, -this.y, -this.z);
  }

  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  multiply(v: Vector): Vector {
    return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
  }

  divide(v: Vector): Vector {
    return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
  }

  scale(size: number): Vector {
    return new Vector(this.x * size, this.y * size, this.z * size);
  }

  equals(v: Vector): boolean {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  dot(v: Vector): number {
    return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
  }

  cross(v: Vector): Vector {
    return new Vector(
      (this.y * v.z) - (this.z * v.y),
      (this.z * v.x) - (this.x * v.z),
      (this.x * v.y) - (this.y * v.x),
    );
  }

  length(): number {
    return Math.sqrt(this.dot(this));
  }

  unit(): Vector {
    return this.scale(1 / this.length());
  }

  min(): number {
    return Math.min(Math.min(this.x, this.y), this.z);
  }

  max(): number {
    return Math.max(Math.max(this.x, this.y), this.z);
  }

  toAngles() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length()),
    };
  }

  angleTo(a: Vector): number {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  }

  toArray(): number[] {
    return [this.x, this.y, this.z];
  }

  clone(): Vector {
    return new Vector(this.x, this.y, this.z);
  }

  randomize(factor: number): Vector {
    const u = new Vector(this.z, this.x, this.y).unit();
    const v = this.cross(u).unit();
    const rad = Math.random() * PI2;
    const multiplierU = Math.cos(rad);
    const multiplierV = Math.sin(rad);
    return this
      .add(u.scale(multiplierU * factor * Math.random()))
      .add(v.scale(multiplierV * factor * Math.random()))
      .unit();
  }

  round(): Vector {
    return new Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));
  }

  static add(a: Vector, b: Vector, out: Vector): Vector {
    out.x = a.x + b.x; // eslint-disable-line no-param-reassign
    out.y = a.y + b.y; // eslint-disable-line no-param-reassign
    out.z = a.z + b.z; // eslint-disable-line no-param-reassign
    return out;
  }

  static subtract(a: Vector, b: Vector, out: Vector): Vector {
    out.x = a.x - b.x; // eslint-disable-line no-param-reassign
    out.y = a.y - b.y; // eslint-disable-line no-param-reassign
    out.z = a.z - b.z; // eslint-disable-line no-param-reassign
    return out;
  }

  static multiply(a: Vector, b: Vector, out: Vector): Vector {
    out.x = a.x * b.x; // eslint-disable-line no-param-reassign
    out.y = a.y * b.y; // eslint-disable-line no-param-reassign
    out.z = a.z * b.z; // eslint-disable-line no-param-reassign
    return out;
  }

  static divide(a: Vector, b: Vector, out: Vector): Vector {
    out.x = a.x / b.x; // eslint-disable-line no-param-reassign
    out.y = a.y / b.y; // eslint-disable-line no-param-reassign
    out.z = a.z / b.z; // eslint-disable-line no-param-reassign
    return out;
  }

  static scale(a: Vector, size: number, out: Vector): Vector {
    out.x = a.x * size; // eslint-disable-line no-param-reassign
    out.y = a.y * size; // eslint-disable-line no-param-reassign
    out.z = a.z * size; // eslint-disable-line no-param-reassign
    return out;
  }

  static cross(a: Vector, b: Vector, out: Vector): Vector {
    out.x = a.y * b.z - a.z * b.y; // eslint-disable-line no-param-reassign
    out.y = a.z * b.x - a.x * b.z; // eslint-disable-line no-param-reassign
    out.z = a.x * b.y - a.y * b.x; // eslint-disable-line no-param-reassign
    return out;
  }

  static fromAngles = (theta: number, phi: number) =>
    new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));

  static randomDirection = () =>
    Vector.fromAngles(Math.random() * PI2, Math.asin(Math.random() * 2 - 1));

  static min = (a: Vector, b: Vector) =>
    new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));

  static max = (a: Vector, b: Vector) =>
    new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));

  static lerp = (a: Vector, b: Vector, fraction: number) => b.subtract(a).scale(fraction).add(a);

  static fromArray = (a: number[]) => new Vector(a[0], a[1], a[2]);

  static angleBetween = (a: Vector, b: Vector) => a.angleTo(b);

  * [Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
}

export default Vector;
