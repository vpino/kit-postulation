/**
* LoginController
* @namespace kpr.authentication.controllers
*/
(function () {
  'use strict';

	angular
		.module('kpr.authentication.controllers')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$location', '$scope', 'Authentication'];

	/**
	* @namespace LoginController
	*/
	function LoginController($location, $scope, Authentication) {
		
		var vm = this;

		vm.login = login;

		activate();

		/**
		* @name activate
		* @desc Actions to be performed when this controller is instantiated
		* @memberOf kpr.authentication.controllers.LoginController
		*/
		function activate() {
			// If the user is authenticated, they should not be here.
			if (Authentication.isAuthenticated()) {
				$location.url('/');
			}

		}


		/**
		* @name login
		* @desc Try to log in with email `email` and password `password`
		* @param {string} email The email entered by the user
		* @param {string} password The password entered by the user
		* @returns {Promise}
		* @memberOf kpr.authentication.services.Authentication
		*/
		function login(form) {
			Authentication.login(
				vm.email, 
				vm.passwd
			).then(loginSuccessFn, loginErrorFn);

			/**
			* @name loginSuccessFn
			* @desc Set the authenticated account and redirect to index
			*/
			function loginSuccessFn(data, status, headers, config) {
				Authentication.setAuthenticatedAccount(data.data);
				$location.path('/');
			}

			/**
			* @name loginErrorFn
			* @desc Log "Epic failure!" to the console
			*/
			function loginErrorFn(data, status, headers, config) {
				vm.error = 'Usuario y/o Contraseña incorrecta';

        		/*Clear Fields*/
    			vm.email = undefined;
				vm.passwd = undefined;
				form.$setValidity();
				form.$setPristine();
				form.$setUntouched();

				console.error(data);
			}

		}

	}

})();