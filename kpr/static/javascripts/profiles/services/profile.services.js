/**
* Profile
* @namespace kpr.profiles.services
*/
(function () {
  'use strict';

    angular
        .module('kpr.profiles.services')
        .factory('Profile', Profile);

    Profile.$inject = ['$http'];

    /**
    * @namespace Profile
    */
    function Profile($http) {
        /**
        * @name Profile
        * @desc The factory to be returned
        * @memberOf kpr.profiles.services.Profile
        */
        var Profile = {
            destroy: destroy,
            get: get,
            update: update
        };

        return Profile;

        /////////////////////

        /**
        * @name destroy
        * @desc Destroys the given profile
        * @param {Object} profile The profile to be destroyed
        * @returns {Promise}
        * @memberOf kpr.profiles.services.Profile
        */
        function destroy(profile) {
            return $http.delete('/postulation/accounts/' + profile + '/');
        }


        /**
        * @name get
        * @desc Gets the profile for user with username `username`
        * @param {string} username The username of the user to fetch
        * @returns {Promise}
        * @memberOf kpr.profiles.services.Profile
        */
        function get(username) {
            return $http.get('/postulation/accounts/' + username + '/');
        }


        /**
        * @name update
        * @desc Update the given profile
        * @param {Object} profile The profile to be updated
        * @returns {Promise}
        * @memberOf kpr.profiles.services.Profile
        */
        function update(profile) {
            return $http.put('/postulation/accounts/' + profile.username + '/', profile);
        }

    }
})();