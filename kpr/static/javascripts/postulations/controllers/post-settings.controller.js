/**
* PostSettingsController
* @namespace kpr.postulations.controllers
*/
(function () {
  'use strict';

    angular
        .module('kpr.postulations.controllers')
        .controller('PostSettingsController', PostSettingsController);

    PostSettingsController.$inject = ['$rootScope', '$scope', '$location', '$routeParams', 'Authentication', 'Postulations'];

    /**
    * @namespace PostSettingsController
    */
    function PostSettingsController($rootScope, $scope, $location, $routeParams, Authentication, Postulations) {
        
        var vm = this;

        vm.error = '';
        vm.success = '';
        
        vm.update = update;

        var authenticatedAccount = Authentication.getAuthenticatedAccount();
        
        activate();

        /**
        * @name activate
        * @desc Actions to be performed when this controller is instantiated.
        * @memberOf kpr.Post.controllers.PostSettingsController
        */
        function activate() {
            
            var id = $routeParams.id;

            console.log(id);

            /* Redirect if not logged in */
            if (!authenticatedAccount) {
                
                vm.error = 'You are not authorized to view this page.';
                console.log("You are not authorized to view this page");
                $location.url('/login');
                
            } else {

                /* Redirect if logged in, but not the owner of this Post. */
                if (!authenticatedAccount.is_admin) {
                    
                    vm.error = 'You are not authorized to view this page.';
                    console.log("You are not authorized to view this page");
                    $location.url('/login');
                    
                }

            }
            
            
            Postulations.get(id)
            .then(PostSuccessFn, PostErrorFn);

                /**
                * @name PostSuccessFn
                * @desc Update `Post` for view
                */
                function PostSuccessFn(data, status, headers, config) {
                    vm.post = data.data;
                }

                /**
                * @name PostErrorFn
                * @desc Redirect to index
                */
                function PostErrorFn(data, status, headers, config) {
                    vm.error = 'That user does not exist.';
                    $location.url('/');
                }

        }
        
        /**
        * @name reset
        * @desc Reset the form fields
        * @memberOf kpr.postulations.controllers.PostSettingsController
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
        * @name update
        * @desc update a Post
        * @memberOf kpr.postulations.controllers.PostSettingsController
        */
        function update(kprForm) {
                    
            Postulations.update(vm.post).then(updatePostSuccessFn, updatePostErrorFn);

            /**
            * @name updatePostSuccessFn
            * @desc Show snackbar with success message
            */
            function updatePostSuccessFn(data, status, headers, config) {
                vm.success = "Postulacion Actualizada ";
                reset(kprForm);
            }


            /**
            * @name updatePostErrorFn
            * @desc Propogate error event and show console.log error message
            */
            function updatePostErrorFn(data, status, headers, config) {
                vm.error = data.error;
                console.error(data.error);
                reset(kprForm);
            }

        }

    }
})();