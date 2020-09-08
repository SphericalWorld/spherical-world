import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import ModalWindow from '../../uiElements/ModalWindow';
import { useSetUIState } from '../../utils/StateRouter';
import { CRAFT } from './craftConstants';
import { Button, InputText, ItemIcon, Label } from '../../uiElements';
import {
  blockCraft,
  settingsCraft,
  sortButton,
  inputText,
  recipesBlock,
  itemCount,
  itemImg,
  recipeName,
  ingredientCraft,
  craftIngredients,
  recipesListWrapper,
  recipesList,
  ingredientsList,
  recipesListItem,
  recipeNameList,
  craftHead,
} from './craft.module.css';
import { blocksInfo } from '../../../../common/blocks/blocksInfo';
import { recipes } from './recipes';
import { fontMain } from '../../styles/fonts.module.css';

const ItemIconCount = ({ count }: { count: number }): JSX.Element => (
  <div className={itemImg}>
    <ItemIcon />
    <span className={classnames(itemCount, fontMain)}>{count}</span>
  </div>
);

const Craft = (): JSX.Element => {
  const setUIState = useSetUIState();
  const close = useCallback(() => setUIState(CRAFT, false), [setUIState]);
  const [indexRecipe, setIndexRecipe] = useState(0);

  return (
    <ModalWindow caption="craft" onClose={close}>
      <div className={blockCraft}>
        <div className={settingsCraft}>
          <Button size="small" className={sortButton}>
            sort <span>⇅</span>
          </Button>
          <InputText className={inputText} description="Search" />
        </div>
        <div className={recipesBlock}>
          <div className={recipesListWrapper}>
            <div className={recipesList}>
              {recipes.map((recipe, ind) => (
                <div className={recipesListItem} role="button" onClick={() => setIndexRecipe(ind)}>
                  <ItemIcon />
                  <div className={recipeNameList}>
                    <Label>{blocksInfo[recipe.itemId].name}</Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={craftIngredients}>
            <div className={craftHead}>
              <ItemIconCount count={recipes[indexRecipe].count} />
              <div className={recipeName}>
                <Label>{blocksInfo[recipes[indexRecipe].itemId].name}</Label>
              </div>
            </div>
            <Label> ingredients </Label>
            <div className={ingredientsList}>
              {recipes[indexRecipe].ingredients.map((ingredient) => (
                <div className={ingredientCraft}>
                  <ItemIconCount count={ingredient.count} />
                  <div className={recipeName}>
                    <Label>{blocksInfo[ingredient.id].name}</Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalWindow>
  );
};

export default Craft;
