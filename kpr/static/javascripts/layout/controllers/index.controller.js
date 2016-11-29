/**
* IndexController
* @namespace kpr.layout.controllers
*/
(function () {
  'use strict';

    angular
        .module('kpr.layout.controllers')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', 'Authentication', 'Postulations'];

    /**
    * @namespace IndexController
    */
    function IndexController($scope, Authentication, Postulations){
        
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();

        if(vm.isAuthenticated){

            vm.data = Authentication.getAuthenticatedAccount();
            
        }
        
        vm.posts = [];

        $('.dropdown-button').dropdown({
            belowOrigin: true, 
            alignment: 'left', 
            inDuration: 200,
            outDuration: 150,
            constrain_width: true,
            hover: false, 
            gutter: 1
        });
        
        activate();

        /**
        * @name activate
        * @desc Actions to be performed when this controller is instantiated
        * @memberOf kpr.layout.controllers.IndexController
        */
        function activate() {
            Postulations.all().then(postsSuccessFn, postsErrorFn);

            /**
            * @name postsSuccessFn
            * @desc Update posts array on view
            */
            function postsSuccessFn(data, status, headers, config) {
                vm.posts = data.data;
            }


            /**
            * @name postsErrorFn
            * @desc Show scope with error
            */
            function postsErrorFn(data, status, headers, config) {
                vm.error(data.error);
            }

        }
    }

})();