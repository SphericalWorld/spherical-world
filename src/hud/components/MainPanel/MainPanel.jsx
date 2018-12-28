// @flow strict
import React from 'react';
import { connect } from 'react-redux';
import {
  mainPanel,
  itemsContainer,
  pagination,
  paginationUp,
  paginationDown,
  paginationPage,
  paginationControl,
  mainPanelSection,
} from './mainPanel.module.scss';
import InventorySlot from '../../uiElements/InventorySlot';
import type { InventorySlotDetails } from '../../uiElements/InventorySlot/InventorySlot';
import type { State } from '../../../reducers/rootReducer';

type StateProps = {|
  +slots: $ReadOnlyArray<InventorySlotDetails | null>;
  +selectedItemIndex: number;
|};

type Props = StateProps;

const MainPanel = ({ slots, selectedItemIndex }: Props) => (
  <section className={mainPanelSection}>
    <div className={mainPanel}>
      <ul className={itemsContainer}>
        { slots.map((slot, index) => (
          <InventorySlot
            key={index}
            slot={slot || undefined}
            selected={index === selectedItemIndex}
          />))
        }
      </ul>
      <div className={pagination}>
        <div className={paginationControl}>
          <div className={paginationUp} />
          <div className={paginationDown} />
        </div>
        <div className={paginationPage}>
          10
        </div>
      </div>
    </div>
  </section>
);

const mapState = ({
  mainPanel: {
    selectedItemIndex,
    slots,
  },
  hudData: {
    player: {
      inventory: {
        items,
      },
    },
  },
}) => ({
  selectedItemIndex,
  slots: slots.map(el => items[el || ''] || null),
});

export default connect<Props, {||}, _, _, State, _>(mapState, null)(MainPanel);
