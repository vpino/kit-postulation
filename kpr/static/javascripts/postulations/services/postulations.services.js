/**
* Postulations
* @namespace kpr.postulations.services
*/
(function () {
'use strict';

    angular
        .module('kpr.postulations.services')
        .factory('Postulations', Postulations);

    Postulations.$inject = ['$http'];

    /**
    * @namespace postulations
    * @returns {Factory}
    */
    function Postulations($http) {
        
        var Postulations = {
          all: all,
          create: create,
          get: get,
          getPostUser: getPostUser,
          update: update
        };

        return Postulations;

        ////////////////////

        /**
        * @name all
        * @desc Get all postulations
        * @returns {Promise}
        * @memberOf kpr.postulations.services.postulations
        */
        function all() {
            return $http.get('/postulation/posts/');
        }


        /**
        * @name create
        * @desc Create a new Post
        * @param {string} content The content of the new Post
        * @returns {Promise}
        * @memberOf kpr.postulations.services.postulations
        */
        function create(repository, name, descrip){
            return $http.post('/postulation/posts/', {
                repository: repository,
                name_postulation: name,
                description_postulation: descrip
            });
        }


        /**
         * @name getPost
         * @desc Get the postulations of a given user
         * @param {string} id The id to get postulations for
         * @returns {Promise}
         * @memberOf kpr.postulations.services.postulations
         */
        function get(id) {
            return $http.get('/postulation/posts/' + id + '/');
        }

        /**
         * @name getPostUser
         * @desc Get the postulations of a given user
         * @param {string} username The username to get postulations for
         * @returns {Promise}
         * @memberOf kpr.postulations.services.postulations
         */
        function getPostUser(username) {
            return $http.get('/postulation/accounts/' + username + '/posts/');
        }

        /**
        * @name update
        * @desc Update the given postulation
        * @param {Object} postulation The postulation to be updated
        * @returns {Promise}
        * @memberOf kpr.postulations.services.postulation
        */
        function update(postulation) {
            return $http.put('postulation/posts/' + postulation.id + '/', postulation);
        }
        
    }

})();