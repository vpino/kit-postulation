/**
* Authentication
* @namespace kpr.authentication.services
*/
(function () {
	'use strict';

	angular
		.module('kpr.authentication.services')
		.factory('Authentication', Authentication);

	Authentication.$inject = ['$cookies', '$http', '$location'];

	/**
	* @namespace Authentication
	* @returns {Factory}
	*/
	function Authentication($cookies, $http, $location) {
		/**
		* @name Authentication
		* @desc The Factory to be returned
		*/

		var Authentication = {
			getAuthenticatedAccount: getAuthenticatedAccount,
			isAuthenticated: isAuthenticated,
			login: login,
			logout: logout,
			register: register,
			setAuthenticatedAccount: setAuthenticatedAccount,
			unauthenticate: unauthenticate
		};
	
	return Authentication;

		///////////////////////

		activate();

		/**
		* @name activate
		* @desc Actions to be performed when this controller is instantiated
		* @memberOf kpr.authentication.controllers.RegisterController
		*/
		function activate() {
			// If the user is authenticated, they should not be here.
			if (Authentication.isAuthenticated()) {
				$location.path('/');
			}

		}

		/**
		* @name register
		* @desc Try to register a new user
		* @param {string} username The username entered by the user
		* @param {string} password The password entered by the user
		* @param {string} email The email entered by the user
		* @returns {Promise}
		* @memberOf kpr.authentication.services.Authentication		
		*/

		function register(email, username, password, admin) {
			return $http.post('/postulation/accounts/', {
				username: username,
				password: password,
				email: email,
				admin: admin
			});
		}

		/**
		* @name login
		* @desc Try to log in with email `email` and password `password`
		* @param {string} email The email entered by the user
		* @param {string} password The password entered by the user
		* @returns {Promise}
		* @memberOf kpr.authentication.services.Authentication
		*/
		function login(email, password) {
			return $http.post('/postulation/login/', {
				email: email, 
				password: password
			});
		}


		/**
		* @name getAuthenticatedAccount
		* @desc Return the currently authenticated account
		* @returns {object|undefined} Account if authenticated, else `undefined`
		* @memberOf kpr.authentication.services.Authentication
		*/
		function getAuthenticatedAccount() {
			
			if (!$cookies.authenticatedAccount) {
				return;
			}

			return JSON.parse($cookies.authenticatedAccount);
		}


		/**
		* @name isAuthenticated
		* @desc Check if the current user is authenticated
		* @returns {boolean} True is user is authenticated, else false.
		* @memberOf kpr.authentication.services.Authentication
		*/
		function isAuthenticated() {
			return !!$cookies.authenticatedAccount;
		}

		/**
		* @name setAuthenticatedAccount
		* @desc Stringify the account object and store it in a cookie
		* @param {Object} user The account object to be stored
		* @returns {undefined}
		* @memberOf kpr.authentication.services.Authentication
		*/
		function setAuthenticatedAccount(account) {
			$cookies.authenticatedAccount = JSON.stringify(account);
		}

		/**
		* @name unauthenticate
		* @desc Delete the cookie where the user object is stored
		* @returns {undefined}
		* @memberOf kpr.authentication.services.Authentication
		*/
		function unauthenticate() {
			delete $cookies.authenticatedAccount;
		}


		/**
		* @name logout
		* @desc Try to log the user out
		* @returns {Promise}
		* @memberOf kṕr.authentication.services.Authentication
		*/
		function logout() {
			return $http.post('/postulation/logout/')
			.then(logoutSuccessFn, logoutErrorFn);

			/**
			* @name logoutSuccessFn
			* @desc Unauthenticate and redirect to index with page reload
			*/
			function logoutSuccessFn(data, status, headers, config) {
				Authentication.unauthenticate();

				$location.path('/login');
			}

			/**
			* @name logoutErrorFn
			* @desc Log "Epic failure!" to the console
			*/
			function logoutErrorFn(data, status, headers, config) {
				console.error('Epic failure!');
			}

		}

	}
	
})();