// @flow
// import './services/swMouse';
// import './hudCore';
import react from 'react';
import reactDom from 'react-dom';
import * as reactRedux from 'react-redux';

const HudApi = function (store) {
  window.gameExternals = {
    react,
    'react-dom': reactDom,
    store,
    'react-redux': reactRedux,
  };
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

HudApi.prototype.showDebugInfo = function () {
  // this.injector.invoke(['$hudApi', function($hudApi) {
  //   angular.element(document.getElementById('hud')).scope().$broadcast('hudDebug-toggleVisibility');
  //   angular.element(document.getElementById('hud')).scope().$digest();
  // }]);
};

export default HudApi;
