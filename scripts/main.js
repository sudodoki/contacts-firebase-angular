(function (window, angular) {
  "use strict";
  var app = angular.module('contactsApp', ['ui.router', 'contactsApp.controllers',
                                          'contactsApp.directives', 'contactsApp.filters'])
    .config(function ($stateProvider) {
      $stateProvider
        .state('home', {
                url: '/',
                abstract: true,
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
        .state('detail', {
                url: 'detail/:id',
                parent: 'home',
                templateUrl: 'views/details.html',
                controller: 'DetailCtrl'
            })
        .state('edit', {
                url: 'edit/:id',
                parent: 'home',
                templateUrl: 'views/edit.html',
                controller: 'EditCtrl'
            })
        .state('create', {
              url: 'create',
              parent: 'home',
              templateUrl: 'views/edit.html',
              controller: 'EditCtrl'
            })
        .state('welcome', {
                url: 'welcome',
                parent: 'home',
                templateUrl: 'views/welcome.html',
                controller: 'WelcomeCtrl'
            })
    })
    .run(function ($state, $rootScope) {
       $state.transitionTo('welcome'); 
       $rootScope.$on('$stateChangeStart', 
        function(event, toState, toParams){
          $rootScope.id = toParams.id;
        })
    })
})(window, angular);




