// import angular from 'angular';
// import './services/swMouse';
// import './hudCore';

const HUD = function () {
  // const self = this;
  // this.providers = {};
  // angular.module('ui', ['hudCore'], ($controllerProvider, $compileProvider, $provide) => {
  //   self.providers = {
  //     $controllerProvider,
  //     $compileProvider,
  //     $provide,
  //   };
  // });
  // this.injector = angular.bootstrap(document.getElementById('hud'), ['ui']);
};

HUD.prototype.showDebugInfo = function () {
  // this.injector.invoke(['$hudApi', function($hudApi) {
  //   angular.element(document.getElementById('hud')).scope().$broadcast('hudDebug-toggleVisibility');
  //   angular.element(document.getElementById('hud')).scope().$digest();
  // }]);
};

export default HUD;
