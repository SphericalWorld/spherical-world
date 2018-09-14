import angular from 'angular';

(function () {
  angular.module('hudCore.swTooltip', ['hudCore.swChat']);

  let tooltipHtml = document.createElement('div');
  tooltipHtml = angular.element(tooltipHtml).html('<div class="tooltip-inner" sw-tooltip-tip><div ng-repeat="item in items"><span class="{{item.l.c}}">{{item.l.t}}</span></div></div>');
  tooltipHtml[0].classList.add('tooltip');

  tooltipHtml[0].addEventListener(
    'mouseover',
    (e) => {
      e.stopPropagation();
      tooltipHtml.toggleClass('tooltip-visible', false);
      return false;
    },
    false,
  );

  angular.element(document.getElementById('hud')).append(tooltipHtml);

  angular.module('hudCore.swTooltip').service('swTooltipService', () => ({ items: [] }));

  angular.module('hudCore.swTooltip').directive('swTooltip', '$rootScope', ($compile, $rootScope) => function (scope, element, attributes) {
    const el = element[0];
    // scope.items = [{l: {t: "qwe", c: "#FF00FF"}}, {l: {t: "asd", c: "#FFFFFF"}, r: {t: "zzz", c: "#00FFFF"}}]
    $compile(tooltipHtml)(scope);
    el.addEventListener(
      'mouseover',
      function (e) {
        tooltipHtml.toggleClass('tooltip-visible', true);
        console.log(angular.element(this));
        // angular.element(this).append(tooltipHtml);
        return false;
      },
      false,
    );

    el.addEventListener(
      'mouseleave',
      (e) => {
        // tooltipHtml.remove();
        tooltipHtml.toggleClass('tooltip-visible', false);
        return false;
      },
      false,
    );

    el.addEventListener(
      'dragstart',
      (e) => {
        // tooltipHtml.remove();
        tooltipHtml.toggleClass('tooltip-visible', false);
        return false;
      },
      false,
    );
  });


  angular.module('hudCore.swTooltip').directive('swTooltipTip', ($compile, $rootScope, swTooltipService) => function (scope, element, attributes) {
    scope.items = swTooltipService.items;
    $compile(tooltipHtml)(scope);
  });

  angular.module('hudCore.swTooltip').directive('swItemTooltip', ($compile, $rootScope, swTooltipService, swChatService) => function (scope, element, attributes) {
    const el = element[0];
    let items = [];

    scope.items = swTooltipService.items;
    scope.$watch(attributes.swItemTooltip, () => {
      if (scope[attributes.swItemTooltip]) {
        const item = scope[attributes.swItemTooltip];
        items = [{ l: { t: item.name, c: `color-${item.rarity}` } }];
        switch (item.rarity) {
          case 'uncommon':
            items.push({ l: { t: 'uncommon', c: 'color-white-label' } });
            break;
          case 'rare':
            items.push({ l: { t: 'rare', c: 'color-white-label' } });
            break;
          default:
        }
        if (item.count > 1) {
          items.push({ l: { t: `amount: ${item.count}`, c: 'color-white-label' } });
        }
      }
    });


    el.addEventListener(
      'mouseover',
      function (e) {
        tooltipHtml.toggleClass('tooltip-visible', true);
        // angular.element(this).append(tooltipHtml);
        const pos = this.getBoundingClientRect();
        angular.element(tooltipHtml)[0].style.top = `${pos.top}px`;
        angular.element(tooltipHtml)[0].style.left = `${pos.left}px`;
        angular.copy(items, swTooltipService.items);
        return false;
      },
      false,
    );

    el.addEventListener(
      'mouseleave',
      (e) => {
        // tooltipHtml.remove();
        tooltipHtml.toggleClass('tooltip-visible', false);
        return false;
      },
      false,
    );

    el.addEventListener(
      'click',
      (e) => {
        if (e.shiftKey) {
          swChatService.sendToInput(scope[attributes.swItemTooltip]);
        }
        return false;
      },
      false,
    );
  });
}());
