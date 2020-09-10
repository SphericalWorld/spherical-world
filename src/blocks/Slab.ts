export const slab = {
  from: [0, 0, 0],
  to: [1, 0.5, 1],
  faces: {
    top: { texture: 'top' },
    bottom: { texture: 'bottom' },
    north: { texture: 'north', uv: [0, 0, 1, 0.5] },
    south: { texture: 'south', uv: [0, 0, 1, 0.5] },
    west: { texture: 'west', uv: [0, 0, 1, 0.5] },
    east: { texture: 'east', uv: [0, 0, 1, 0.5] },
  },
} as const;
