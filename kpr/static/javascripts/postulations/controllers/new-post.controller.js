/**
* NewPostController
* @namespace kpr.postulations.controllers
*/
(function () {
  'use strict';

    angular
        .module('kpr.postulations.controllers')
        .controller('NewPostController', NewPostController);

    NewPostController.$inject = ['$rootScope', '$scope', 'Authentication', 'Postulations', '$location'];

    /**
    * @namespace NewPostController
    */
    function NewPostController($rootScope, $scope, Authentication, Postulations, $location) {
        
        var vm = this;

        vm.error = '';
        vm.success = '';
        vm.submit = submit;
        
        var authenticatedAccount = Authentication.getAuthenticatedAccount();
        
        activate();

        /**
        * @name activate
        * @desc Actions to be performed when this controller is instantiated.
        * @memberOf kpr.Post.controllers.PostSettingsController
        */
        function activate() {
            
            /* Redirect if not logged in */
            if (!authenticatedAccount) {
                
                vm.error = 'You are not authorized to view this page.';
                $location.url('/login');
                
            } 
        }

        /**
        * @name reset
        * @desc Reset the form fields
        * @memberOf kpr.postulations.controllers.NewPostController
        */

        function reset(form) {
            if (form) {
                vm.repository = undefined;
                vm.name = undefined;
                vm.description = undefined;
                form.$setValidity();
                form.$setPristine();
                form.$setUntouched();
            }
        }
        /**
        * @name submit
        * @desc Create a new Post
        * @memberOf kpr.postulations.controllers.NewPostController
        */
        function submit(kprForm) {
                    
            vm.username = Authentication.getAuthenticatedAccount().username;

            Postulations.create(vm.repository, 
                               vm.name,
                               vm.description
            ).then(createPostSuccessFn, createPostErrorFn);


            /**
            * @name createPostSuccessFn
            * @desc Show snackbar with success message
            */
            function createPostSuccessFn(data, status, headers, config) {
                vm.success = "Postulacion exitosa ";
                reset(kprForm);
            }


            /**
            * @name createPostErrorFn
            * @desc Propogate error event and show console.log error message
            */
            function createPostErrorFn(data, status, headers, config) {
                vm.error = data.error;
                console.error(data);
                reset(kprForm);
            }

        }

    }
})();