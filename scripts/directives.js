(function (window, angular) {
  "use strict";
  var directives = angular.module('contactsApp.directives', [])
    .directive('disposable', function(){
      return {
        restrict: 'A',
        link: function($scope, el, attrs) {
          el.find('button').bind('click', function(){
            el.remove()
          })
        }
      }
    })
    .directive('instaField', function($timeout, $compile){
      function open(select) {
        $timeout(function(){
          var evt = document.createEvent("MouseEvents")
          evt.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0,
                              false, false, false, false, 0, null);
          select[0].dispatchEvent(evt);
        }, 4)
      }
      function createInput(type) {
        var input = "<section disposable><input ng-model=\"" + type + "Fake\" placeholder=\"Go ahead, enter " + type + "\" type=\"" + type + "\">"
        var saveButton = "<button ng-click=\"update('" + type + "')\">Save</button></section>"
        return input + saveButton
      }
      return {
        restrict: 'EA',
        templateUrl: 'views/instaField.directive.html',
        scope: false,
        replace: true,
        link: function($scope, el, attrs) {
          var type;
          var select = el.find('select'),
              button = el.find('button');
          button.bind('click', function(e){
            select.prop("selectedIndex", -1);
            el.toggleClass('active')
            open(select)
          })
          select.bind('change select', function(e){
            type = select.val();
            if (!type) {return}
            if (el.parent().find("input[type='" + type + "']").length == 0) {
              el.parent().children(":eq(-1)").eq(0).after($compile(createInput(type))($scope))
            }
          })
        }
      }
    })
// &&&&&&&&&&&&&&&&&
  .directive('tagInput', function($parse) {
    return {
      restrict: 'A',
      replace: true,
      transclude: true,
      templateUrl: 'views/inputTag.directive.html',
      controller: function($scope) {
        $scope.addTag = function() {
          if (!$scope.inputTags) {$scope.inputTags = []}
          if ($scope.tagText.length == 0) {
            return;
          }
          if ($scope.inputTags.indexOf($scope.tagText) == -1) {
            $scope.inputTags.push($scope.tagText);
          }
          $scope.tagText = '';
        }

        $scope.deleteTag = function(key) {
          if ($scope.inputTags.length > 0 &&
            $scope.tagText.length == 0 &&
            key === undefined) {
            $scope.inputTags.pop();
          } else if (key != undefined) {
            $scope.inputTags.splice(key, 1);
          }
        }
      },
      link: function(scope, element, attrs) {
        var  input = element.find('input'),
            newTag = input.attr('new-tag'),
            deleteTag = input.attr('delete-tag');
        scope.inputTags = $parse(attrs.ngModel)(scope);
        scope.tagText = ''
        scope.$watch('inputTags', function(newValue, oldValue){
          $parse(attrs.ngModel).assign(scope, newValue)
        }, true)
        scope.$watch(attrs.ngModel, function(value) {
          scope.inputTags = value
        });

        element.bind('keydown', function(e) {
          if (e.which == 9) {
            e.preventDefault();
          }

          if (e.which == 8) {
            scope.$apply(deleteTag);
          }
        });

        element.bind('keyup', function(e) {
          var key = e.which;
          // Tab or Enter pressed 
          if (key == 9 || key == 13) {
            e.preventDefault();
            scope.$apply(newTag);
          }
        });
      }
    }
  });

// &&&&&&&&&&&&&&&&&
})(window, angular)