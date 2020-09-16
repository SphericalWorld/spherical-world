import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import ModalWindow from '../../uiElements/ModalWindow';
import { useSetUIState } from '../../utils/StateRouter';
import { CRAFT } from './craftConstants';
import { Button, InputText, ItemIcon, Label, InputNumber } from '../../uiElements';
import {
  craftSettings,
  sortButton,
  inputText,
  recipesSection,
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
  craftingCount,
  inputCraftCountLabel,
  inputCraftCount,
} from './craft.module.css';
import { recipes } from './recipes';
import { fontMain } from '../../styles/fonts.module.css';
import { scrollbarBox } from '../../uiElements/Scrollbar/scrollbar.module.css';
import { blocksInfo } from '../../../blocks/blocksInfo';
import { useHudApi } from '../../HudApi';
import { GameEvent } from '../../../Events';

const ItemIconCount = ({ count, src }: { count: number; src: string }): JSX.Element => (
  <div className={itemImg}>
    <ItemIcon src={src} />
    <span className={classnames(itemCount, fontMain)}>{count}</span>
  </div>
);

const Craft = (): JSX.Element => {
  const setUIState = useSetUIState();
  const close = useCallback(() => setUIState(CRAFT, false), [setUIState]);
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [amountToCraft, setAmountToCraft] = useState(1);
  const api = useHudApi();

  return (
    <ModalWindow caption="craft" onClose={close}>
      <div className={craftSettings}>
        <Button size="small" className={sortButton}>
          sort <span>⇅</span>
        </Button>
        <InputText className={inputText} description="Search" />
      </div>
      <div className={recipesSection}>
        <div className={recipesListWrapper}>
          <div className={classnames(recipesList, scrollbarBox)}>
            {recipes.map((recipe, ind) => (
              <div className={recipesListItem} role="button" onClick={() => setRecipeIndex(ind)}>
                <ItemIcon size="small" src={blocksInfo[recipe.itemId]?.itemImage} />
                <div className={recipeNameList}>
                  <Label>{blocksInfo[recipe.itemId].name}</Label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={craftIngredients}>
          <div className={craftHead}>
            <ItemIconCount
              count={recipes[recipeIndex].count}
              src={blocksInfo[recipes[recipeIndex].itemId].itemImage}
            />
            <div className={recipeName}>
              <Label>{blocksInfo[recipes[recipeIndex].itemId].name}</Label>
            </div>
          </div>
          <Label> ingredients </Label>
          <div className={ingredientsList}>
            {recipes[recipeIndex].ingredients.map((ingredient) => (
              <div className={ingredientCraft}>
                <ItemIconCount count={ingredient.count} src={blocksInfo[ingredient.id].itemImage} />
                <div className={recipeName}>
                  <Label>{blocksInfo[ingredient.id].name}</Label>
                </div>
              </div>
            ))}
          </div>
          <div className={craftingCount}>
            <Button
              size="small"
              onClick={() =>
                api.dispatchGameEvent({
                  type: GameEvent.playerCraftAttempt,
                  payload: {
                    amount: amountToCraft,
                    recipeId: recipes[recipeIndex].id,
                  },
                })
              }
            >
              Create
            </Button>
            <div className={inputCraftCountLabel}>
              <InputNumber
                onChange={(number) => setAmountToCraft(number)}
                className={inputCraftCount}
              />
              {recipes[recipeIndex].count !== 1 ? (
                <Label>
                  &nbsp; X {recipes[recipeIndex].count} &nbsp; = &nbsp;
                  {recipes[recipeIndex].count * amountToCraft}
                </Label>
              ) : (
                ''
              )}
            </div>
            <Button size="small">all resources</Button>
          </div>
        </div>
      </div>
    </ModalWindow>
  );
};

export default Craft;
