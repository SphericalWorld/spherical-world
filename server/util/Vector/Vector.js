// @flow

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

  add(v: Vector | number): Vector {
    if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    return new Vector(this.x + v, this.y + v, this.z + v);
  }

  subtract(v: Vector | number): Vector {
    if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    return new Vector(this.x - v, this.y - v, this.z - v);
  }

  multiply(v: Vector | number): Vector {
    if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
    return new Vector(this.x * v, this.y * v, this.z * v);
  }

  divide(v: Vector | number): Vector {
    if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    return new Vector(this.x / v, this.y / v, this.z / v);
  }

  equals(v: Vector): boolean {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  dot(v: Vector): number {
    return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
  }

  cross(v: Vector): Vector {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    );
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  unit() {
    return this.divide(this.length());
  }

  min() {
    return Math.min(Math.min(this.x, this.y), this.z);
  }

  max() {
    return Math.max(Math.max(this.x, this.y), this.z);
  }

  toAngles() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length()),
    };
  }

  angleTo(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  }

  toArray(n) {
    return [this.x, this.y, this.z].slice(0, n || 3);
  }

  clone() {
    return new Vector(this.x, this.y, this.z);
  }

  randomize(factor: number) {
    const u = new Vector(this.z, this.x, this.y).unit();
    const v = this.cross(u).unit();
    const rad = Math.random() * Math.PI * 2;
    const multiplierU = Math.cos(rad);
    const multiplierV = Math.sin(rad);
    return this.add(u.multiply(multiplierU * factor * Math.random())).add(v.multiply(multiplierV * factor * Math.random())).unit();
  }

  round(): Vector {
    return new Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));
  }

  static negative(a, b) {
    b.x = -a.x; b.y = -a.y; b.z = -a.z;
    return b;
  }

  static add(a, b, c) {
    if (b instanceof Vector) { c.x = a.x + b.x; c.y = a.y + b.y; c.z = a.z + b.z; } else { c.x = a.x + b; c.y = a.y + b; c.z = a.z + b; }
    return c;
  }

  static subtract(a, b, c) {
    if (b instanceof Vector) { c.x = a.x - b.x; c.y = a.y - b.y; c.z = a.z - b.z; } else { c.x = a.x - b; c.y = a.y - b; c.z = a.z - b; }
    return c;
  }

  static multiply(a, b, c) {
    if (b instanceof Vector) { c.x = a.x * b.x; c.y = a.y * b.y; c.z = a.z * b.z; } else { c.x = a.x * b; c.y = a.y * b; c.z = a.z * b; }
    return c;
  }

  static divide(a, b, c) {
    if (b instanceof Vector) { c.x = a.x / b.x; c.y = a.y / b.y; c.z = a.z / b.z; } else { c.x = a.x / b; c.y = a.y / b; c.z = a.z / b; }
    return c;
  }

  static cross(a, b, c) {
    c.x = a.y * b.z - a.z * b.y;
    c.y = a.z * b.x - a.x * b.z;
    c.z = a.x * b.y - a.y * b.x;
    return c;
  }

  static unit(a, b) {
    const length = a.length();
    b.x = a.x / length;
    b.y = a.y / length;
    b.z = a.z / length;
    return b;
  }

  static fromAngles(theta, phi) {
    return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
  }

  static randomDirection() {
    return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
  }

  static min(a, b) {
    return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
  }

  static max(a, b) {
    return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
  }

  static lerp(a, b, fraction) {
    return b.subtract(a).multiply(fraction).add(a);
  }

  static fromArray(a) {
    return new Vector(a[0], a[1], a[2]);
  }

  static angleBetween(a, b) {
    return a.angleTo(b);
  }

  * [Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
}

export default Vector;
