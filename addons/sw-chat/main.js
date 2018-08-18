// (function () {
//   angular.module('ui').controller('sw-chat', ['$scope', '$hudApi', '$sce', 'swChatService', function ($scope, $hudApi, $sce, swChatService) {
//     $scope.$hudApi = $hudApi;
//     $scope.swChatService = swChatService;
//
//     $scope.textToSend = '';
//     $scope.slot = {
//       name: 'iron', count: 24, blockId: 9, rarity: 'uncommon', icon: 'textures/items/iron_ingot.png',
//     };
//     $scope.items = swChatService.items;
//     $scope.player = {
//       name: $scope.$hudApi.player.name,
//     };
//     $scope.currentChannel = $scope.swChatService.channels[0];
//
//     $scope.sendMessage = function () {
//       console.log($scope.textToSend);
//       if ($scope.textToSend == '/spawn') {
//         $scope.player.x;
//       }
//       $scope.textToSend = '';
//     };
//
//     console.log('init chat');
//   }]);
//
//   angular.module('ui').directive('swChatInput', ['$sce', '$compile', function ($sce, $compile) {
//     return {
//       restrict: 'A', // only activate on element attribute
//       require: '?ngModel', // get a hold of NgModelController
//       link(scope, element, attrs, ngModel) {
//         if (!ngModel) return; // do nothing if no ng-model
//
//         // Specify how UI should be updated
//         ngModel.$render = function () {
//           element.html(ngModel.$viewValue || '');
//           $compile(element.contents())(scope);
//         };
//         // Listen for change events to enable binding
//         element.on('keyup change', (e) => {
//           // console.log(element.html(), e)
//           scope.$apply(read);
//         });
//         read(); // initialize
//
//         // Write data to the model
//         function read() {
//           const html = element.html().replace(/<div>/g, '').replace(/<br>/g, '').replace(/<\/div>/g, '');
//           ngModel.$setViewValue(html);
//           console.log(html);
//           ngModel.$render();
//         }
//       },
//     };
//   }]);
// }());
