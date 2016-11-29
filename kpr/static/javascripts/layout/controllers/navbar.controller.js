/**
* NavbarController
* @namespace kpr.layout.controllers
*/
(function () {
'use strict';

    angular
        .module('kpr.layout.controllers')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', 'Authentication', '$timeout'];

    /**
    * @namespace NavbarController
    */
    function NavbarController($scope, Authentication, $timeout) {
        var vm = this;

        vm.logout = logout;

        vm.isAuthenticated = Authentication.isAuthenticated();

        if(vm.isAuthenticated){

            vm.data = Authentication.getAuthenticatedAccount();
        
        }

        var dropdown = function() {
             $('.dropdown-button').dropdown({
            belowOrigin: true, 
            alignment: 'left', 
            inDuration: 200,
            outDuration: 150,
            constrain_width: true,
            hover: false, 
            gutter: 1
            });
        }

        $timeout(dropdown, 0);

        /**
        * @name logout
        * @desc Log the user out
        * @memberOf kpr.layout.controllers.NavbarController
        */
        function logout() {
            Authentication.logout();
        }

    }

})();