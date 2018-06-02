// @flow

// const k = index >>> 8;
// // const index2 = index & 0xFF;
// const i = (index >>> 4) & 0xF;
// const j = index & 0xF;
//
export const getGeoId = (x: number, z: number): string => `${x | 0}_${z | 0}`;

export const getIndex = (x: number, y: number, z: number) => x + (z << 4) + (y << 8);
