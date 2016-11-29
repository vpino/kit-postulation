/**
* Register controller
* @namespace kpr.authentication.controllers
*/
(function () {
	'use strict';

	angular
		.module('kpr.authentication.controllers')
		.controller('RegisterController', RegisterController);

	RegisterController.$inject = ['$location', '$scope', 'Authentication'];

	/**
	* @namespace RegisterController
	*/
	function RegisterController($location, $scope, Authentication) {
		
		var vm = this;

		vm.register = register;
		vm.error = '';
		vm.success = '';
		vm.admin = false;

		/**
	    * @name reset
	    * @desc Reset the form fields
	    * @memberOf kpr.authentication.controllers.RegisterController
	    */

		function reset(form) {
			if (form) {
				vm.username = undefined;
				vm.email = undefined;
				vm.passwd = undefined;
				form.$setValidity();
				form.$setPristine();
				form.$setUntouched();
			}
		}


		/**
		* @name register
		* @desc Try to register a new user
		* @param {string} email The email entered by the user
		* @param {string} password The password entered by the user
		* @param {string} username The username entered by the user
		* @returns {Promise}
		* @memberOf kpr.authentication.services.Authentication
		*/
		function register(kprForm) {

			Authentication.register(
				vm.email,
				vm.username,
				vm.passwd,
				vm.admin
			).then(registerSuccessFn, registerErrorFn);

			/**
			* @name registerSuccessFn
			* @desc Log the new user in
			*/
			function registerSuccessFn(data, status, headers, config) {
				vm.success = 'Usuario creado correctamente';
				
				reset(kprForm);

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
				* @desc Log "data!" to the console and redirect to index
				*/
				function loginErrorFn(data, status, headers, config) {
					
					console.error(data);

					$location.path('/');

				}


			}

			/**
			* @name registerErrorFn
			* @desc Log "data" to the console
			*/
			function registerErrorFn(data, status, headers, config) {
				vm.error = data.message;

				/*Clear Fields*/
				reset(kprForm);
			}

		}

	}

})();