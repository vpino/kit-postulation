/**
* ProfileController
* @namespace kpr.profiles.controllers
*/
(function () {
  'use strict';

	angular
		.module('kpr.profiles.controllers')
		.controller('ProfileController', ProfileController);

	ProfileController.$inject = ['$location', '$routeParams', 'Postulations', 'Profile'];

	/**
	* @namespace ProfileController
	*/
	function ProfileController($location, $routeParams, Postulations, Profile) {
		
		var vm = this;

		vm.profile = undefined;
		vm.posts = [];

		activate();

		/**
		* @name activate
		* @desc Actions to be performed when this controller is instantiated
		* @memberOf kpr.profiles.controllers.ProfileController
		*/
		function activate() {

			var username = $routeParams.username;

			Profile.get(username).then(profileSuccessFn, profileErrorFn);
			Postulations.get(username).then(postsSuccessFn, postsErrorFn);

			/**
			* @name profileSuccessProfile
			* @desc Update `profile` on viewmodel
			*/
			function profileSuccessFn(data, status, headers, config) {
				vm.profile = data.data;
			}


			/**
			* @name profileErrorFn
			* @desc Redirect to index and show error Snackbar
			*/
			function profileErrorFn(data, status, headers, config) {
				$location.url('/');
				vm.error = ('That user does not exist.');
			}


			/**
			* @name postsSucessFn
			* @desc Update `posts` on viewmodel
			*/
			function postsSuccessFn(data, status, headers, config) {
				vm.posts = data.data;
			}


			/**
			* @name postsErrorFn
			* @desc Show error snackbar
			*/
			function postsErrorFn(data, status, headers, config) {
				vm.error = (data.data.error);
			}

		}

	}

})();