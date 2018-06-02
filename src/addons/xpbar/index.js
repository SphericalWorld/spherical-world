// (function () {
//   angular.module('ui').controller('xpbar', ($scope, $hudApi) => {
//     $scope.$hudApi = $hudApi;
//     $scope.msg = 'test addon';
//     $scope.$watch(() => $hudApi.player.exp, (newValue, oldValue) => {
//       $scope.xpBarStyle = { width: `${newValue / $hudApi.player.expForLevel * 100}%` };
//     });
//   });
// }());
