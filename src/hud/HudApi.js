// @flow strict
// import './services/swMouse';
import react from 'react';
import reactDom from 'react-dom';
import * as reactRedux from 'react-redux';
import type { Store } from '../store/store';

const HudApi = function (store: Store) {
  window.gameExternals = {
    react,
    'react-dom': reactDom,
    store,
    'react-redux': reactRedux,
  };
};

HudApi.prototype.showDebugInfo = function () {
  // this.injector.invoke(['$hudApi', function($hudApi) {
  //   angular.element(document.getElementById('hud')).scope().$broadcast('hudDebug-toggleVisibility');
  //   angular.element(document.getElementById('hud')).scope().$digest();
  // }]);
};

export default HudApi;
