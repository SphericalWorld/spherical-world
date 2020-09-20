import { oakPlanks } from './oakPlanks';
import { slab } from './slab';
import { stoneBrick } from './stoneBrick';
import { podzol } from './podzol';

type Recipe = Readonly<{
  id: string;
  itemId: number;
  ingredients: ReadonlyArray<{
    id: number;
    count: number;
  }>;
  count: number;
}>;

export const craftRecipes: { [key: string]: Recipe } = {
  oakPlanks,
  slab,
  stoneBrick,
  podzol,
};

export const craftRecipesArray = Object.values(craftRecipes);
