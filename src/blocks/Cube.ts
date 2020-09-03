export const cube = {
  from: [0, 0, 0],
  to: [1, 1, 1],
  faces: {
    top: { texture: 'top' },
    bottom: { texture: 'bottom' },
    north: { texture: 'north' },
    south: { texture: 'south' },
    west: { texture: 'west' },
    east: { texture: 'east' },
  },
} as const;
