/**
* kpr module
* @namespace kpr.js
*/
(function () {
	'use strict';

	angular
		.module('kpr', [
			'kpr.config',
			'kpr.routes',
			'kpr.authentication',
			'kpr.layout',
			'kpr.postulations',
			'kpr.profiles'
		])
		.run(run);

	run.$inject = ['$http'];

	angular
		.module('kpr.routes', ['ngRoute', 'ngResource']);

	angular
		.module('kpr.config', []);


	/**
	* @name run
	* @desc Update xsrf $http headers to align with Django's defaults
	*/
	function run($http) {
	  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
	  $http.defaults.xsrfCookieName = 'csrftoken';
	}

})();
