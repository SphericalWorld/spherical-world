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

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  mainPanel,
  itemsContainer,
  pagination,
  paginationUp,
  paginationDown,
  paginationPage,
  selectedSlot,
  slotItem,
  slot as slotStyle,
  slotItemCount,
} from './mainPanel.scss';

type InventorySlot = {|
  +count: number;
|};

type StateProps = {|
  +slots: $ReadOnlyArray<InventorySlot>;
  +selectedItemIndex: number;
|};

type Props = StateProps;

const Slot = ({ slot, selected }: { slot: InventorySlot, selected: boolean }) => (
  <li sw-droppable="true" className={`${slotStyle} ${String(selected && selectedSlot)}`}>
    <div>
      <div className={slotItem} sw-droppable="true" sw-draggable="slot" ng-style="{'background-image': 'url({{slot.icon}})'}" sw-item-tooltip="slot">
        <span className={slotItemCount}>{slot.count}</span>
      </div>
    </div>
  </li>
);

class MainPanel extends PureComponent<Props> {
  render() {
    const { slots, selectedItemIndex } = this.props;
    return (
      <section>
        <div className={mainPanel}>
          <ul className={itemsContainer}>
            { slots.map((slot, index) =>
              <Slot slot={slot} selected={index === selectedItemIndex} />)
            }
          </ul>
          <div className={pagination}>
            <div className={paginationUp} />
            <div className={paginationDown} />
            <div className={paginationPage}>1</div>
          </div>
        </div>
      </section>
    );
  }
}

const mapState = () => ({
  selectedItemIndex: 3,
  slots: (new Array(10)).fill(0).map((_, index) => ({
    count: index,
  })),
});

export default connect(mapState, null)(MainPanel);
