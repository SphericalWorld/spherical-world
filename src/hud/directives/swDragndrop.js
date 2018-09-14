import angular from 'angular';

(function () {
  let draggedObject = null;
  let draggedScope = null;
  let draggedAttributes = null;
  angular.module('hudCore.swDragndrop', []);

  angular.module('hudCore.swDragndrop').directive('swDraggable', () => function (scope, element, attributes) {
    const el = element[0];
    scope.$watch(attributes.swDraggable, () => {
      if (scope.$eval(attributes.swDraggable)) {
        el.draggable = true;
        el.addEventListener(
          'dragstart',
          function (e) {
            this.style.cursor = 'move';
            this.style.opacity = '0.7';
            e.dataTransfer.effectAllowed = 'move';
            draggedObject = scope[attributes.swDraggable];
            draggedScope = scope;
            draggedAttributes = attributes;
            return false;
          },
          false,
        );

        el.addEventListener(
          'dragend',
          function (e) {
            this.style.opacity = '1';
            this.id = '';
            scope.$apply((scope) => {
              const fn = scope[attributes.draggableOnDragEnd];
              if (typeof fn !== 'undefined') {
                fn();
              }
            });
            return false;
          },
          false,
        );
      } else {
        el.draggable = false;
      }
    }, true);
  });

  angular.module('hudCore.swDragndrop').directive('swDroppable', () => function (scope, element, attributes) {
    const el = element[0];
    el.addEventListener(
      'dragover',
      (e) => {
        e.dataTransfer.dropEffect = 'move';
        if (e.preventDefault) {
          e.preventDefault();
        }
        scope.$apply((scope) => {
          // var fn = scope.droppableOnDragOver();
          // if (typeof fn != "undefined") {
          // 	fn(scope, element, e);
          // }
        });
        return false;
      },
      false,
    );

    el.addEventListener(
      'dragenter',
      function (e) {
        e.dataTransfer.dropEffect = 'move';
        if (e.preventDefault) {
          e.preventDefault();
        }
        this.style['box-shadow'] = 'inset 0px 0px 15px 0px rgba(60, 60, 60, 1)';
        return false;
      },
      false,
    );

    el.addEventListener(
      'dragleave',
      e => false,
      false,
    );

    el.addEventListener(
      'drop',
      function (e) {
        this.style.opacity = '1';
        if (e.stopPropagation) {
          e.stopPropagation();
        }

        // console.log(draggedObject);
        // console.log(draggedScope);


        scope.$apply((scope) => {
          const fn = scope[attributes.swDroppableOndrop];

          // console.log(scope.$eval(attributes.swDroppableOndrop))
          if (typeof fn !== 'undefined') {
            fn(draggedScope, scope, draggedObject);
          }
        });

        return false;
      },
      false,
    );
  });
}());
