import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from 'store';
import App from './App';
import './style.scss';

const root = document.getElementById('addon-debug');
if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root,
);

// (function () {
//   angular.module('ui').controller('hudDebugController', ($scope, $hudApi) => {
//     $scope.hudDebugVisible = true;
//
//     $scope.$hudApi = $hudApi;
//     $scope.player = $hudApi.player;
//
//     $scope.$on('hudDebug-toggleVisibility', (event) => {
//       $scope.hudDebugVisible = !$scope.hudDebugVisible;
//     });
//   });
// }());
