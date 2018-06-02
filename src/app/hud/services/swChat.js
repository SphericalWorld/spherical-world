import angular from 'angular';


angular.module('hudCore.swChat', []);

angular.module('hudCore.swChat').factory('swChatService', ['$rootScope', function () {
  const service = {
    messages: {
      1: [{ name: '', data: 'qwe wqe <b sw-item-tooltip="slot" >ewqewq</b>' }, { name: '', data: '' }],
    },
    channels: [{ id: 1, name: '1. common' }],
    textToSend: '',
    items: [],
    sendToInput(data) {
      console.log(data);
      this.items.push(data);
      this.textToSend += '<span class="{{\'color-\'+slot.rarity}}" sw-item-tooltip="items[0]" >[item]</span>';
    },
  };
  return service;
}]);
