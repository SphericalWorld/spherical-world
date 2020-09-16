import { PODZOL, GRASS, OAK_LEAVES } from '../../blocks';

export const podzol = {
  id: 'podzol',
  itemId: PODZOL,
  ingredients: [
    {
      id: GRASS,
      count: 1,
    },
    {
      id: OAK_LEAVES,
      count: 4,
    },
  ],
  count: 1,
};
