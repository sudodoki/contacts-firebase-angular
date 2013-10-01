(function (window, angular) {
  "use strict";
  var controllers = angular.module('contactsApp.controllers', [])
  controllers.controller('HomeCtrl', function(Person, $http, $scope, $location) {
    $scope.Ctrl = 'HomeCtrl';
    $scope.persons = Person.all($scope)
    $scope.categories = Person.allCategories()

    $scope.toggleCategory = function(category) {
      if ($scope.filter.category.indexOf(category) == -1) {
        $scope.filter.category.push(category)
      } else {
        $scope.filter.category.splice($scope.filter.category.indexOf(category), 1)
      }
    }

    $scope.isCategorySelected = function(category) {
      return ($scope.filter.category.indexOf(category) != -1)
    }
    $scope.isFilterEmpty = function() {
      return ($scope.filter.name == '' && $scope.filter.category.length == 0)
    }
    $scope.resetFilter = function(){
      $scope.filter = {name: '', category: []}
    }
    function userify(incoming) {
      var u = incoming.user
      return {
        seed: incoming.seed,
        name: u.name.first,
        surname: u.name.last,
        email: u.email,
        phone: [u.phone, u.cell]
      }
    }
    $scope.delete = function(person, index) {
      console.log(person.id)
      if ($scope.id == person.id) {
        $scope.$evalAsync($location.path('/welcome'));
      }
      $scope.persons.splice(index,1);
      Person.removePerson(person, $scope)
      person = null
    }
    $scope.getRandom = function() {
      $http.get('http://api.randomuser.me/', {params: {seed: 'shi' + Math.random()  }}).then(function(data){
        var user = userify(data.data.results[0])
        Person.addPerson(user)
      })
    }
    $scope.resetFilter()
  })
  controllers.controller('WelcomeCtrl', function($scope, Comment){
    $scope.comments = []
    $scope.$watch(Comment.authorized, function(value){
      $scope.authorized = value;
      $scope.$watch(Comment.all, function(value){
        if (value){$scope.comments = Comment.all()};
      })
    })
    $scope.logout = Comment.logout;
    $scope.login = function(type) {
      switch(type)
      {
        case 'github':
          Comment.authGithub()
          break;
        case 'facebook':
          Comment.authFacebook()
          break;
      }
    }
    $scope.addComment = function(text) {
      Comment.addComment(text);
      $scope.commentToBe = ''
    }
  })
  controllers.controller('EditCtrl', function($scope, $state, Person) {
    var person,
      id = $scope.id;

    $scope.button = id ? 'Save Person' : 'Add Person'
    if (!id) {
      person = Person.emptyPerson()
      $scope.fakePerson = {}
    } else {
      person = Person.get(id)
      Person.find(id).then(function(person){
        $scope.fakePerson = person
      })
    }
    $scope.updatePerson = function(){
      person.set($scope.fakePerson, function(error){
        $scope.$apply(
          $state.transitionTo('detail', {id: id || 'latest'})
        );
      })
    }
  })
  controllers.controller('DetailCtrl', function($scope, $state, $filter, Person) {
    if ($scope.id == 'latest') {
      $state.transitionTo('detail', {id: Person.last().id})
    }
    $scope.person = Person.find($scope.id)
    $scope.person.then(function(person){
      $scope.update = function(type) {
        if (typeof person[type] == 'undefined') {
          person[type] = [];
        }
        person[type].push($scope[type+'Fake'])
        Person.get($scope.id).set(person, function(error){
          $scope.$apply();
        })
        $scope[type+'Fake'] = ''
      }
    })
  })

})(window, angular)