// @flow
// import './services/swMouse';
// import './hudCore';
import react from 'react';
import reactDom from 'react-dom';
import * as reactRedux from 'react-redux';


const HUD = function (store) {
  window.gameExternals = {
    react,
    'react-dom': reactDom,
    store,
    'react-redux': reactRedux,
  };
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
