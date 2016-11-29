/**
* authentication module
* @namespace authentication.module.js
*/
(function () {
	'use strict';

	angular
		.module('kpr.authentication', [
			'kpr.authentication.controllers',
			'kpr.authentication.services'
		]);

	angular
		.module('kpr.authentication.controllers', []);

	angular
		.module('kpr.authentication.services', ['ngCookies']);

})();