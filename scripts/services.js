(function (window, angular) {
  "use strict";
  var app = angular.module('contactsApp')
   .factory('Person', function($q){
        var baseUrl = 'https://sudodoki.firebaseio.com/persons'
        var safeApply = function() { var phase = this.$root.$$phase; if (!(phase == '$apply' || phase == '$digest')) { this.$apply(); } };
        var contactDB = new Firebase(baseUrl);'https://sudodoki.firebaseio.com/persons'
        var persons = [], person, index;
        var allCategories = [];
        contactDB.on('child_changed', function(snapshot){
          var temp = snapshot.val()
          addTwoSets(allCategories,temp.category)
          index = persons.map(function(i){return i.id}).indexOf(snapshot.name())
          angular.extend(persons[index], temp)
        })
        contactDB.on('child_removed', function(snapshot){
          persons = persons.filter(function(iterating){ return iterating.id != snapshot.name()})
        })
        function get(id) {
          return contactDB.child(id)
        }
        function emptyPerson(){
          return contactDB.push();
        }
        function addTwoSets(target, toAdd) {
          if (toAdd === undefined) { return target }
          for (var i = 0; i < toAdd.length; i++) {
            if (target.indexOf(toAdd[i]) == -1) {
              target.push(toAdd[i])
            }
          }
          return target;

        }
        return {
          all: function($scope) {
            contactDB.on('child_added', function(snapshot) {
              person = snapshot.val();
              person.id = snapshot.name();
              addTwoSets(allCategories, person.category)
              persons.push(person)
              safeApply.call($scope)
            });
            return persons;
          },
          emptyPerson: emptyPerson,
          get: get,
          find: function(id) {
            var deferred = $q.defer()
              get(id).on('value', function(snapshot) {
                  deferred.resolve(snapshot.val())
              });
            return deferred.promise
          },
          addPerson: function(person) {
            return emptyPerson().set(person);
          },
          removePerson: function(person) {
            return get(person.id).remove()
          },
          last: function() {
            return persons.slice(-1)[0]
          },
          allCategories: function() {
            return allCategories;
          }
        }
        return contactDB;
      })
       .factory('Comment', function($rootScope){
          var commentUser, notification = {}, pool = [];
          var safeApply = function() { var phase = this.$root.$$phase; if (!(phase == '$apply' || phase == '$digest')) { this.$apply(); } };

          var commentDB = new Firebase('https://sudodoki.firebaseio.com/comments');
          commentDB.on('child_added', function(snapshot) {
            pool.push(snapshot.val())
            safeApply.call($rootScope)
          });
          var auth =  new FirebaseSimpleLogin(commentDB, function(error, user) {
             if (error) {
                notification = {type:'error', msg: error}
              } else if (user) {

                $rootScope.$apply(function(){
                  commentUser = user;// user authenticated with Firebase
                })
                console.log('User ID: ' + user.id + ', Provider: ' + user.provider, !!user);
              } else {
                notification = {type:'info', msg: "Logging out, c'ya"}
                commentUser = undefined
              }
          })
        return {
          all: function($scope){
            if (commentUser) {
              return pool
            } else {
              return []
            }
          },
          addComment: function(text){
            if (commentUser) {
              var name = commentUser.displayName || commentUser.username
              commentDB.push({name: name, msg: text})
            }
          },
          authGithub: function($scope){
            auth.login('github', {
              rememberMe: true,
            })
          },
          authFacebook: function($scope){
            auth.login('facebook', {
              rememberMe: true,
            })
          },
          authorized: function(){
            return !!commentUser
          },
          logout: function(){
            auth.logout();

          }
        }

      })
})(window, angular);