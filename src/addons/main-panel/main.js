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
//     $scope.selected = 3;
//     $scope.items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     for (let i = 0; i < $scope.bags[0].slots.length; i++) {
//       $scope.items[i] = $scope.bags[0].slots[i];
//     }
//     console.log('init main-panel');
//   }]);
// }());
