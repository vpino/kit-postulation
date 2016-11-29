/**
* ProfileSettingsController
* @namespace kpr.profiles.controllers
*/
(function () {
  'use strict';

    angular
        .module('kpr.profiles.controllers')
        .controller('ProfileSettingsController', ProfileSettingsController);

    ProfileSettingsController.$inject = [
    '$location', '$routeParams', 'Authentication', 'Profile'
    ];

    /**
    * @namespace ProfileSettingsController
    */
    function ProfileSettingsController($location, $routeParams, Authentication, Profile) {
        
        var vm = this;

        vm.destroy = destroy;
        vm.update = update;

        var authenticatedAccount = Authentication.getAuthenticatedAccount();
        
        activate();


        /**
        * @name activate
        * @desc Actions to be performed when this controller is instantiated.
        * @memberOf kpr.profiles.controllers.ProfileSettingsController
        */
        function activate() {
            
            
            var username = $routeParams.username;

            /* Redirect if not logged in */
            if (!authenticatedAccount) {
                
                console.log("You are not authorized to view this page");
                $location.url('/');
                vm.error = 'You are not authorized to view this page.';

            } else {

                /* Redirect if logged in, but not the owner of this profile. */
                if (authenticatedAccount.username !== username) {
                    
                    console.log("You are not authorized to view this page");
                    $location.url('/');
                    vm.error = 'You are not authorized to view this page.';
                
                }

            }

            Profile.get(username)
            .then(profileSuccessFn, profileErrorFn);

                /**
                * @name profileSuccessFn
                * @desc Update `profile` for view
                */
                function profileSuccessFn(data, status, headers, config) {
                    vm.profile = data.data;
                }

                /**
                * @name profileErrorFn
                * @desc Redirect to index
                */
                function profileErrorFn(data, status, headers, config) {
                    $location.url('/');
                    vm.error = 'That user does not exist.';
                }
        }


        /**
        * @name destroy
        * @desc Destroy this user's profile
        * @memberOf kpr.profiles.controllers.ProfileSettingsController
        */
        function destroy() {
        
            Profile.destroy(authenticatedAccount.username)
            .then(profileSuccessFn, profileErrorFn);

            /**
            * @name profileSuccessFn
            * @desc Redirect to index and display success snackbar
            */
            function profileSuccessFn(data, status, headers, config) {
                Authentication.unauthenticate();
                $location.url('/');
                vm.success = 'Your account has been deleted.';
            }


            /**
            * @name profileErrorFn
            * @desc Display error snackbar
            */
            function profileErrorFn(data, status, headers, config) {
                vm.error = data;
            }

        }

        /**
        * @name reset
        * @desc Reset the form fields
        * @memberOf kpr.authentication.controllers.RegisterController
        */

        function reset(form) {
            if (form) {
                vm.profile = undefined;
                form.$setValidity();
                form.$setPristine();
                form.$setUntouched();
            }
        }


        /**
        * @name update
        * @desc Update this user's profile
        * @memberOf kpr.profiles.controllers.ProfileSettingsController
        */
        function update(kprForm) {
            
            Profile.update(vm.profile).then(profileSuccessFn, profileErrorFn);

            /**
            * @name profileSuccessFn
            * @desc Show success snackbar
            */
            function profileSuccessFn(data, status, headers, config) {
                vm.success = 'Your profile has been updated.';

                reset(kprForm);
            }


            /**
            * @name profileErrorFn
            * @desc Show error snackbar
            */
            function profileErrorFn(data, status, headers, config) {
                vm.error = data.error;

                reset(kprForm);
            }
        }

    }

})();