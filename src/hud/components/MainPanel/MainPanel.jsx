// @flow

// (function () {
//   angular.module('ui').controller('mainPanel', ['$scope', '$hudApi', 'swMouseService', function ($scope, $hudApi, swMouseService) {
//     $scope.$hudApi = $hudApi;
//
//     $scope.bags = $scope.$hudApi.player.inventory;
//
//     swMouseService.onWheelUp(() => {
//       $scope.selected++;
//       if ($scope.selected == $scope.items.length) {
//         $scope.selected = 0;
//       }
//       $scope.$hudApi.player.selectedItem = $scope.items[$scope.selected];
//     });
//     swMouseService.onWheelDown(() => {
//       $scope.selected--;
//       if ($scope.selected == -1) {
//         $scope.selected = $scope.items.length - 1;
//       }
//       $scope.$hudApi.player.selectedItem = $scope.items[$scope.selected];
//     });
//
//     for (let i = 0; i < $scope.bags[0].slots.length; i++) {
//       $scope.items[i] = $scope.bags[0].slots[i];
//     }
//     console.log('init main-panel');
//   }]);
// }());

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
} from './mainPanel.scss';
import InventorySlot from '../../uiElements/InventorySlot';
import type { InventorySlotDetails } from '../../uiElements/InventorySlot/InventorySlot';

type StateProps = {|
  +slots: $ReadOnlyArray<InventorySlotDetails>;
  +selectedItemIndex: number;
|};

type Props = StateProps;

const MainPanel = ({ slots, selectedItemIndex }: Props) => (
  <section className={mainPanelSection}>
    <div className={mainPanel}>
      <ul className={itemsContainer}>
        { slots.map((slot, index) =>
          <InventorySlot slot={slot} selected={index === selectedItemIndex} />)
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

const imageSlots = (new Array(11)).fill(0).map((_, index) => ({
  count: index,
  image: `${Math.random() > 0.5 ? 'diamond' : 'ironIngot'}`,
}));

const mapState = () => ({
  selectedItemIndex: 3,
  slots: imageSlots,
});

export default connect(mapState, null)(MainPanel);
