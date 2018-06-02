// (function () {
//   angular.module('ui').controller('sw-minimap', ['$scope', '$hudApi', function ($scope, $hudApi) {
//     $scope.$hudApi = $hudApi;
//     $scope.terrain = $hudApi.terrain;
//     $scope.textToSend = '';
//
//     $scope.player = $scope.$hudApi.player;
//
//     // $scope.$watch(function() { return $scope.terrain.minimap; }, function(newValue, oldValue){
//     //   console.log(newValue, oldValue)
//     // })
//     $scope.coords = {
//       x: 0,
//       y: 0,
//     };
//     $scope.$watch('player.x', () => {
//       $scope.coords.x = `${Math.round(-$scope.player.x - 16)}px`;
//     });
//     $scope.$watch('player.z', () => {
//       $scope.coords.z = `${Math.round(-$scope.player.z - 16)}px`;
//     });
//
//     console.log('init minimap');
//   }]);
// }());
