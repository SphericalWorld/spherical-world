// (function () {
//   angular.module('ui').controller('inventory', ['$scope', '$hudApi', function ($scope, $hudApi) {
//     $scope.$hudApi = $hudApi;
//     $scope.bags = $scope.$hudApi.player.inventory;
//     $scope.player = {
//       name: $scope.$hudApi.player.name,
//     };
//
//     console.log($scope);
//
//     $scope.opened = false;
//     $scope.toggle = function () {
//       console.log('toggle inv');
//       $scope.opened = !$scope.opened;
//     };
//
//     $scope.onDrop = function (draggedScope, droppedScope, object) {
//       console.log(draggedScope.$index, droppedScope.$index);
//       console.log(draggedScope.$parent.bags[0].slots);
//
//       const tmp = $scope.bags[0].slots[droppedScope.$index];
//       $scope.bags[0].slots[droppedScope.$index] = $scope.bags[0].slots[draggedScope.$index];
//       $scope.bags[0].slots[draggedScope.$index] = tmp;
//
//       // $scope.opened = !$scope.opened;
//     };
//
//     console.log('init inventory');
//   }]);
// }());
