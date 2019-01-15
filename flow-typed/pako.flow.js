// @flow strict
declare module 'pako' {
  declare interface DeflateOptions {
    level?: number;
    windowBits?: number;
    memLevel?: number;
    strategy?: number;
    dictionary?: any;
    raw?: boolean;
    to?: "string";
  }
  declare interface InflateOptions {
    windowBits?: number;
    raw?: boolean;
    to?: "string";
  }
  declare type Data = Uint8Array | Array<number> | string;

  /**
   * Compress data with deflate algorithm and options.
   */
  declare export function deflate(
    data: Data,
    options?: DeflateOptions & {
      to: "string"
    }
  ): string;

  /**
   * Compress data with deflate algorithm and options.
   */
  declare export function deflate(data: Data, options: DeflateOptions & {to: 'string'}): string;
  declare export function deflate(data: Data, options?: DeflateOptions): Uint8Array;

  /**
   * The same as deflate, but creates raw data, without wrapper (header and adler32 crc).
   */
  declare export function deflateRaw(data: Data, options: DeflateOptions & {to: 'string'}): string;
  declare export function deflateRaw(data: Data, options?: DeflateOptions): Uint8Array;

  /**
   * The same as deflate, but create gzip wrapper instead of deflate one.
   */
  declare export function gzip(data: Data, options: DeflateOptions & {to: 'string'}): string;
  declare export function gzip(data: Data, options?: DeflateOptions): Uint8Array;

  /**
   * Decompress data with inflate/ungzip and options. Autodetect format via wrapper header
   * by default. That's why we don't provide separate ungzip method.
   */
  declare export function inflate(data: Data, options: InflateOptions & {to: 'string'}): string;
  declare export function inflate(data: Data, options?: InflateOptions): Uint8Array;

  /**
   * The same as inflate, but creates raw data, without wrapper (header and adler32 crc).
   */
  declare export function inflateRaw(data: Data, options: InflateOptions & {to: 'string'}): string;
  declare export function inflateRaw(data: Data, options?: InflateOptions): Uint8Array;

  declare export class Deflate {
    constructor(options?: DeflateOptions): this;
    err: number;
    msg: string;
    result: Uint8Array | Array<number>;
    onData(chunk: Data): void;
    onEnd(status: number): void;
    push(data: Data | ArrayBuffer, mode?: number | boolean): boolean;
  }
  declare export class Inflate {
    constructor(options?: InflateOptions): this;
    err: number;
    msg: string;
    result: Data;
    onData(chunk: Data): void;
    onEnd(status: number): void;
    push(data: Data | ArrayBuffer, mode?: number | boolean): boolean;
  }
}
