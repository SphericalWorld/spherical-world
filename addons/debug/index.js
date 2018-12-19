// @flow strict
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from 'store';
import App from './App';
import './style.scss';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('addon-debug'),
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
