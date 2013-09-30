(function (window, angular) {
  "use strict";
  var filters = angular.module('contactsApp.filters', [])
    .filter('capitalize', function(){
      return function(input) {
        if (!input) return;
        return input[0].toUpperCase() + input.slice(1)
      }
    })
    .filter('toArray', function(){
      return function(input) {
        if(!angular.isArray(input)) {
          return [input];
        } else {
          return input;
        }
      }
    })
    .filter('toList', function(){
      return function(input, separator) {
        if(angular.isArray(input)) {
          return input.join(separator || ', ')
        } else {
          return input
        }
      }
    })
    .filter('toOptions', function(){
      return function (input) {
        input.map(function(value){return {name: value, selected: false}})
      }
    })
})(window, angular);
