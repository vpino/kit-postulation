/**
* Register route
* @namespace kpr.routes.js
*/
(function () {
	'use strict';

	angular
		.module('kpr.routes')
		.config(config)

	config.$inject = ['$routeProvider'];

	/**
	* @name config
	* @desc Define valid application routes
	*/
	function config($routeProvider) {
	
		$routeProvider
		.when('/register', {
			controller: 'RegisterController',
			controllerAs: 'vm',
			templateUrl: '/static/templates/authentication/register.html'
		})
		.when('/register/admin', {
			controller: 'RegisterController',
			controllerAs: 'vm',
			templateUrl: '/static/templates/authentication/register-admin.html'
		})
		.when('/login', {
			controller: 'LoginController',
			controllerAs: 'vm',
			templateUrl: '/static/templates/authentication/login.html'
		})
		.when('/', {
			controller: 'IndexController',
			controllerAs: 'vm',
			templateUrl: '/static/templates/layout/index.html'
		})
		.when('/create/post', {
			controller: 'NewPostController',
			controllerAs: 'vm',
			templateUrl: '/static/templates/postulations/post.html'
		})
		.when('/profile/:username', {
			controller: 'ProfileSettingsController',
			controllerAs: 'vm',
			templateUrl: '/static/templates/profiles/settings.html'
		})
		.when('/update/post/:id', {
			controller: 'PostSettingsController',
			controllerAs: 'vm',
			templateUrl: '/static/templates/postulations/post-update.html'
		})
		.otherwise({
			redirectTo: '/'
		});


	}

})();