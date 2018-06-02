import angular from 'angular';

(function () {
  const hudCore = angular.module('hudCore', ['hudCore.swDragndrop', 'hudCore.swTooltip', 'hudCore.swMouse']);
  hudCore.factory('$hudApi', () => ({
  }));

  hudCore.factory('swChatApi', [function () {
    return {
      messages: {
        1: [{ name: '', data: 'qwe wqe <b sw-item-tooltip="slot" >ewqewq</b>' }, { name: '', data: '' }],
      },
      channels: [{ id: 1, name: '1. common' }],
    };
  }]);
}());
