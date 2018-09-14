import angular from 'angular';

(function function_name (argument) {
  angular.module('hudCore.swMouse', []);
  angular.module('hudCore.swMouse').factory('swMouseService', ['$rootScope', function($rootScope) {
    // var mouse = new Mouse();
    // mouse.onWheel(function(wheelDelta){
    //   $rootScope.$apply(function(){
    //     if (wheelDelta>0){
    //       for (var i = 0; i < onWheelUpHandlers.length; i++) {
    //         onWheelUpHandlers[i]();
    //       };
    //     }else{
    //       for (var i = 0; i < onWheelDownHandlers.length; i++) {
    //         onWheelDownHandlers[i]();
    //       };
    //     }
    //   })
    // })
    var onWheelUpHandlers = [];
    var onWheelDownHandlers = [];
    var service = {
      onWheelUp: function(handler){
        onWheelUpHandlers.push(handler);
      },
      onWheelDown: function(handler){
        onWheelDownHandlers.push(handler);
      }
    };
    return service;
  }]);
})();
