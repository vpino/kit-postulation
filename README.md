## Simple App To Postulate Services Using:

![Django logo](https://www.djangoproject.com/s/img/logos/django-logo-negative.svg "Django") ![Django Rest Framework logo](http://www.django-rest-framework.org/img/logo.png "Django Rest Framework")

![Angularjs logo](https://angularjs.org/img/AngularJS-large.png "Angularjs") 

![Materializezeccs logo](https://s-media-cache-ak0.pinimg.com/564x/9a/86/59/9a86598cbbb0d691940725545a2eb505.jpg "[Materializezeccs")

![Nginx logo](https://nginx.org/nginx.png "Nginx")


# Simple Tutorial !! :D

====================================================================================================

## First, let's talk a little

The application consists in allow to a user postulate your
recipes or services created in ansible, for another application 
called kit-servicios 

#### Modules:

* Authentication: To the authentication of system.
* Postulations: Module with a CRUD for postulated a recipe.
* Tests: To validate that the recipe is correct.

And in this consists our app :D !!

## Setting up your environment

Follow the setup instructions now.

* Step only if you used Distribution CANAIMA 5

```bash
$ nano /etc/*-release
```

with nano or another editor, change the id and codename chimanta for jessie:

```bash
LSB_VERSION="5.0"
DISTRIB_DESCRIPTION="Canaima GNU/Linux Chimantá"
DISTRIB_ID="jessie"
DISTRIB_RELEASE="5"
DISTRIB_CODENAME="jessie"
```

* Install nodejs and npm

```bash
$ curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash 

$ sudo apt-get install -y nodejs

$ npm install --global npm@latest

```

* Install virtualenv

```bash
$ apt install virtualenv
```

* Create virtualenv for depends of django (python)

```bash
$ virtualenv env-postulation

And activate

$ . env-postulation/bin/activate
```

* Install requirements Backend

```bash
$ pip install -r Requirements.txt
```

## Install tools of Backend and Frontend

* Create project in django

```bash
$ django-admin startproject kpr

$ cd kpr
```

* Install depends of Frontend

1 - Create a Bower configuration file .bowerrc in the project root (as opposed to your home directory) with the path for our components (js, css, img, font ..):

```bash
{
  "directory" : "static/bower_components"
}
```

2 - Create a file package.json with the next content

```bash
{
  "name": "kit-postulation-recipes",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "http://gitlab.canaima.softwarelibre.gob.ve/canaima-gnu-linux/kit-postulation.git"
  },
  "author": "Victor Pino",
  "license": "ISC",
  "bugs": {
    "url": "http://gitlab.canaima.softwarelibre.gob.ve/canaima-gnu-linux/kit-postulation/issues"
  },
  "homepage": "http://gitlab.canaima.softwarelibre.gob.ve/canaima-gnu-linux/kit-postulation",
  "dependencies": {
    "bower": "^1.7.9"
  }
}
```

3 - Create a file bower.json which 
It contains all components that let's use

```bash
{
  "name": "kit-postulation-recipes",
  "description": "Postulate Recipes",
  "version": "1.0",
  "homepage": "http://gitlab.canaima.softwarelibre.gob.ve/canaima-gnu-linux/kit-servicios/",
  "license": "MIT",
  "private": true,
  "dependencies": {
    "angular": "1.4.x",
    "angular-mocks": "1.4.x",
    "jquery": "~2.1.1",
    "angular-route": "1.4.x",
    "angular-resource": "1.4.x",
    "materialize": "^0.97.7"
  }
}

```

And now execute:

```bash
$ npm install -g bower
$ npm install
$ bower install
```

## Let's start to program 

In Django, the concept of an "app" is used to organize code in a meaningful way. An app is a module that houses code for models, view, serializers, etc that are all related in some way. By way of example, our first step in building our Django and AngularJS web application will be to create an app called authentication. The authentication app will contain the code relevent to the Account model we just talked about as well as views for logging in, logging out and register.

Make a new app called authentication by running the following command:

```bash
$ python manage.py startapp authentication
```

## Creating the Account model

To get started, we will create the Account model we just talked about.

Open authentication/models.py in your favorite text editor and edit it to reflect the following:

```python
from django.contrib.auth.models import AbstractBaseUser
from django.db import models

class Account(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=40, unique=True)

    first_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40, blank=True)
    tagline = models.CharField(max_length=140, blank=True)

    is_admin = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_name

```

Let's take a closer look at attributes more important and method in turn.

```python
email = models.EmailField(unique=True)

# ...

USERNAME_FIELD = 'email'
```

Django's built-in User requires a username. That username is used for logging the user in. By contrast, our application will use the user's email address for this purpose.

To tell Django that we want to treat the email field as the username for this model, we set the USERNAME_FIELD attribute to email. The field specified by USERNAME_FIELD must be unique, so we pass the unique=True argument in the email field.

```
created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)
```

The created_at field records the time that the Account object was created. By passing auto_now_add=True to models.DateTimeField, we are telling Django that this field should be automatically set when the object is created and non-editable after that.

Similar to created_at, updated_at is automatically set by Django. The difference between auto_now_add=True and auto_now=True is that auto_now=True causes the field to update each time the object is saved.

```
REQUIRED_FIELDS = ['username']
```

We will be displaying the username in multiple places. To this end, having a username is not optional, so we include it in the REQUIRED_FIELDS list. Normally the required=True argument would accomplish this goal, but because this model is replacing the User model, Django requires us to specify required fields in this way.

## Making a Manager class for Account

When substituting a customer user model, it is required that you also define a related Manager class the overrides the create_user() and create_superuser() methods.

With authentication/models.py still open, add the following class above the Account class:

```python
from django.contrib.auth.models import BaseUserManager

class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address.')

        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username.')

        account = self.model(
            email=self.normalize_email(email), username=kwargs.get('username')
        )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)

        account.is_admin = True
        account.save()

        return account

```

* Like we did with Account, let's step through this file line-by-line. We will only cover new information.

```
account = self.create_account(email, password, **kwargs)

account.is_admin = True
account.save()
```

## Changing the Django AUTH_USER_MODEL setting

Even though we have created this Account model, the command python manage.py createsuperuser (which we will talk more about shortly) still creates User objects. This is because, at this point, Django still believes that User is the model we want to use for authentication.

To set things straight and start using Account as our authentication model, we have to update settings.AUTH_USER_MODEL.

Open kpr/settings.py and add the following to the end of the file:

```
AUTH_USER_MODEL = 'authentication.Account'
``` 

## Installing your first app

In Django, you must explicitly declare which apps are being used. Since we haven't added our authentication app to the list of installed apps yet, we will do that now.

Open kpr/settings.py and append 'authentication', to INSTALLED_APPS like so:

```python
INSTALLED_APPS = [
    '....',
    'rest_framework',
    'authentication',
]
```

## Migrating your first app

Anyone with a background in Rails will find the concept of migrations familiar. In short, migrations handle the SQL needed to update the schema of our database so you don't have to. By way of example, consider the Account model we just created. These models need to be stored in the database, but our database doesn't have a table for Account objects yet. What do we do? We create our first migration! The migration will handle adding the tables to the database and offer us a way to rollback the changes if we make a mistake.

migrations for the authentication:

```bash
$ python manage.py makemigrations

$ python manage.py migrate
```

## Serializing the Account Model

The AngularJS application we are going to build will make AJAX requests to the server to get the data it intends to display. Before we can send that data back to the client, we need to format it in a way that the client can understand; in this case, we choose JSON. The process of transforming Django models to JSON is called serialization and that is what we will talk about now.

As the model we want to serialize is called Account, the serializer we will create is going to be called AccountSerializer.

## Django REST Framework

Django REST Framework is a toolkit that provides a number of features common to most web applications, including serializers. We will make use of these features throughout the tutorial to save us both time and frustration. Our first look at Django REST Framework starts here.

More a


## AccountSerializer

Before we write our serializers, let's create a serializers.py file inside our authentication app:

```
touch authentication/serializers.py
```

Open authentication/serializers.py and add the following code and imports:

```python
from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from authentication.models import Account

class AccountSerializer(serializers.ModelSerializer):

  password = serializers.CharField(write_only=True, required=False)
  confirm_password = serializers.CharField(write_only=True, required=False)

  class Meta:

    model = Account
    fields = ('id', 'email', 'username', 'created_at',
          'first_name', 'last_name', 'tagline', 'password',
          'confirm_password', 'is_admin')
    read_only_fields = ('created_at', 'updated_at')

    def create(self, validated_data):
      return Account.objects.create(**validated_data)

    def update(self, instance, validated_data):
      instance.username = validated_data.get('username', instance.username)
      instance.tagline = validated_data.get('tagline', instance.tagline)

      instance.save()

      password = validated_data.get('password', None)
      confirm_password = validated_data.get('confirm_password', None)

      if password and confirm_password and password == confirm_password:
          instance.set_password(password)
          instance.save()

      update_session_auth_hash(self.context.get('request'), instance)

      return instance
```


To serializer a model with serializer it used the following tools:

* Meta: The Meta sub-class defines metadata the serializer requires to operate

* model: Here it specific the model that you want serialize.

* fields: Fields that you want serializers of the model.

* Method creae and update: Earlier we mentioned that we sometimes want to turn JSON into a Python object. This is called deserialization and it is handled by the .create() and .update() methods. When creating a new object, such as an Account, .create() is used. When we later update that Account, .update() is used.

* update_session_auth_hash(self.context.get('request'), instance): When a user's password is updated, their session authentication hash must be explicitly updated. If we don't do this here, the user will not be authenticated on their next request and will have to log in again.

Making the account API viewset


Now we go to create a view with Django Rest Framework based in ModelViewSet which offers an interface for listing, creating, retrieving, updating and destroying objects of a given model.

The parameters to create the view are:

* lookup_field: we will use the username attribute of the Account model to look up accounts instead of the id attribute. Overriding lookup_field handles this for us.

* queryset: The query

* serializer_class: Class that serializer the model

Also we will go create two methods:

* get_permissions: Method to verify The only user that should be able to call dangerous methods (such as update() and delete()) is the owner of the account.

* create: We will by overriding the .create() method for this viewset and using Account.objects.create_user() to create the Account object. For a problem the hash password.


Open authentication/views.py and replace it's contents with the following code:

```python
class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        
        serializer = self.serializer_class(data=request.data)
        
        admin = request.data.get('admin', None)

        if serializer.is_valid():

            if admin is not None or admin:
                
                Account.objects.create_superuser(**serializer.validated_data)

                return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
             

            Account.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)
```

In this section of code, verified that parameter "admin" is true or false to
create a user admin:

```python
admin = request.data.get('admin', None)

  if serializer.is_valid():

      if admin is not None or admin:
          
          Account.objects.create_superuser(**serializer.validated_data)

          return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
```

## Making the IsAccountOwner permission

Now we will created a pretty basic permission. If there is a user associated with the current request, we check whether that user is the same object as account. If there is no user associated with this request, we simply return False.
Let's create the IsAccountOwner() permission from the view we just made.

Create a file called authentication/permissions.py with the following content:

```python
from rest_framework import permissions

class IsAccountOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, account):
        if request.user:
            return account == request.user
        return False
```

### Adding an API endpoint

Now that we have created the view, we need to add it to the URLs file. Open kpr/urls.py and update it to look like so:

```python
from django.conf.urls import url, include
from authentication.views import AccountViewSet
from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'accounts', views.AccountViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
```

### An Angular service for registering new users

With the API endpoint in place, we can create an AngularJS service that will handle communication between the client and the server.

Make a file in static/javascripts/authentication/services/ called authentication.service.js and add the following code:

```javascript
/**
* Authentication
* @namespace kpr.authentication.services
*/
(function () {
	'use strict';

	angular
		.module('kpr.authentication.services')
		.factory('Authentication', Authentication);

	Authentication.$inject = ['$cookies', '$resource'];

	/**
	* @namespace Authentication
	* @returns {Factory}
	*/
	function Authenticaction($cookies, $resource) {
		/**
		* @name Authentication
		* @desc The Factory to be returned
		*/

		var Authentication ={
			register: register
		};

		return Authentication;

		///////////////////////

		/**
    * @name register
    * @desc Try to register a new user
    * @param {string} username The username entered by the user
    * @param {string} password The password entered by the user
    * @param {string} email The email entered by the user
    * @returns {Promise}
    * @memberOf kpr.authentication.services.Authentication    
    */

    function register(email, username, password, admin) {
      return $http.post('/postulation/accounts/', {
        username: username,
        password: password,
        email: email,
        admin: admin
      });
    }

	}
	
})();
```

As mentioned before, we need to make an AJAX request to the API endpoint we made. As data, we include the username, password and email parameters this method received. We have no reason to do anything special with the response, so we will let the caller of Authentication.register handle the callback.

### Making a navbar to APP 

Create a file in static/templates/layout/ called navbar.html with the following content:

```html5
<div ng-controller="NavbarController as vm">

    <ul id="dropdown1" class="dropdown-content">
            <li><a href="/create/post"> Postulaciones </a></li>
            <li><a ng-href="/profile/{{vm.data.username}}">Perfil</a></li>
            <li><a href="javascript:void(0)" ng-click="vm.logout()">Cerrar Sesion</a></li>
    </ul>

    <ul id="dropdown2" class="dropdown-content">
            <li><a href="/create/post"> Postulaciones </a></li>
            <li><a ng-href="/profile/{{vm.data.username}}">Perfil</a></li>
            <li><a href="javascript:void(0)" ng-click="vm.logout()">Cerrar Sesion</a></li>
    </ul>

    <nav class="white" role="navigation">

        <div class="nav-wrapper container">

            <a id="logo-container" class="brand-logo"><img src="/static/img/canaima-banner.png"></a>

            <ul class="right hide-on-med-and-down">

                <li><a href="/"> Inicio </a></li>
                <li><a href="http://gitlab.canaima.softwarelibre.gob.ve/">GitLab</a></li>
                <li><a href="http://canaima.softwarelibre.gob.ve/">Canaima</a></li>
                <li ng-show="!vm.isAuthenticated"><a href="/login/">Iniciar Sesion</a></li>
                <li ng-show="!vm.isAuthenticated"><a href="/register/">Registrate</a></li>
                <li ng-show="vm.data.is_admin"><a href="/register/admin/">Registrar Admin</a></li>
                <li ng-show="vm.isAuthenticated" ><a class="dropdown-button" href="#!" data-activates="dropdown1">{{vm.data.username}}<i class="material-icons right">arrow_drop_down</i></a></li>

            </ul>

            <ul id="nav-mobile" class="side-nav">

                <li><a href="/"> Inicio </a></li>
                <li><a href="http://gitlab.canaima.softwarelibre.gob.ve/">GitLab</a></li>
                <li><a href="http://canaima.softwarelibre.gob.ve/">Canaima</a></li>
                <li ng-show="!vm.isAuthenticated"><a href="/login/">Iniciar Sesion</a></li>
                <li ng-show="!vm.isAuthenticated"><a href="/register/">Registrate</a></li>
                <li ng-show="vm.data.is_admin"><a href="/register/admin/">Registrar Admin</a></li>
                <li ng-show="vm.isAuthenticated"><a class="dropdown-button" href="#!" data-activates="dropdown2">{{vm.data.username}}<i class="material-icons right">arrow_drop_down</i></a></li>

            </ul>

            <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>

        </div>

    </nav>

</div>
```


### Making an interface for registering new users

Let's begin creating the interface users will use to register. Begin by creating a file in static/templates/authentication/ called register.html with the following content:

```html5


<div class="row">

  <form class="col s12" name="kprForm" novalidate role="form" ng-submit="vm.register(kprForm)" >

    <div class="row">
      <h1 class="col s12 m12 l4 push-l4"> Registrar Usuario </h1>
    </div>
    
    <div class="row"> 

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">account_circle</i>
        <input class="validate"  name="username" type="text" ng-model="vm.username" pattern="[ñáéíóúA-Za-z ]+" required>
        <label> Nombre de usuario </label>

        <div ng-show="kprForm.$submitted || kprForm.username.$touched">

          <div class="card-panel" ng-show="kprForm.username.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              Nombre de usuario es requerido
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">email</i>
        <input class="validate" ng-model="vm.email" name="email" type="email" required />
        <label> Email </label>
        
        <div ng-show="kprForm.$submitted || kprForm.email.$touched">

          <div class="card-panel" ng-show="kprForm.email.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              El Email es requerido
             </p>

          </div>

          <div class="card-panel" ng-show="kprForm.email.$error.email">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              El email no es valido
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">vpn_key</i>
        <input ng-model="vm.passwd" name="passwd" type="password" class="validate" required pattern="[ñáéíóúA-Za-z 0-9 .]+">
        <label> Contraseña </label>
        
        <div ng-show="kprForm.$submitted || kprForm.passwd.$touched">

          <div class="card-panel" ng-show="kprForm.passwd.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              La Contraseña es requerida
             </p>

          </div>

        </div>

      </div>

    </div>


    <div ng-if="!!vm.success">
    
      <div class="card-panel col s12 m12 l4 push-l4">
        
        <p> 
          <i class="medium material-icons waves-effect waves-light">
            thumb_up
          </i>
          {{vm.success}}
         </p>

      </div>
    
    </div>

    <div ng-if="!!vm.error">
    
      <div class="card-panel col s12 m12 l4 push-l4">
        
        <p> 
          <i class="medium material-icons waves-effect waves-light">
            report_problem
          </i>
          {{vm.error}}
         </p>

      </div>
    
    </div>

    <div class="row">

      <div class="col s12 m12 l4 push-l4"> 
        
        <br><br>

        <div class="fixed-action-btn horizontal right-align" style="position: relative;">
          
          <a href="#!" class="btn-floating btn-large waves-light">
            <i class="large material-icons">menu</i>
          </a>

          <ul>
            
            <li>

              <button type="submit" class="btn-floating red" ng-disabled="kprForm.$invalid">
                <i class="material-icons">
                note_add
                </i>
              </button>
              Registrar

            </li>

          </ul>

        </div>

      </div>

    </div>

  </form>
  
</div>
```

We won't go into much detail this time because this is pretty basic HTML. A lot of the classes come from Materializeccs.


### Controlling the interface with RegisterController

With a service and interface in place, we need a controller to hook the two together. The controller we create, RegisterController will allow us to call the register method of the Authentication service when a user submits the form we've just built.

Create a file in static/javascripts/authentication/controllers/ called register.controller.js and add the following:

```javascript
/**
* Register controller
* @namespace kpr.authentication.controllers
*/
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

		/**
	    * @name reset
	    * @desc Reset the form
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

        $location.path('/');

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
```

### Registration Routes and Modules

Let's set up some client-side routing so users of the app can navigate to the register form.

Create a file in static/javascripts called kpr.routes.js and add the following:

```javascript
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
		$routeProvider.when('/register', {
			controller: 'RegisterController',
			controllerAs: 'vm',
			templateUrl: '/static/templates/authentication/register.html'
		}).otherwise('/');
	}

})();

```

### Setting up AngularJS modules

Let us quickly discuss modules in AngularJS.

In Angular, you must define modules prior to using them. So far we need to define kpr.authentication.services, kpr.authentication.controllers, and kpr.routes. Because kpr.authentication.services and kpr.authentication.controllers are submodules of kpr.authentication, we need to create a kpr.authentication module as well.

Create a file in static/javascripts/authentication/ called authentication.module.js and add the following:

```javascript
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
```

Now we need define to include kpr.authentication and kpr.routes as dependencies of kpr.

Open static/javascripts/kpr.js, define the required modules, and include them as dependencies of the kpr module. Note that kpr.routes relies on ngRoute, which is included with the kpr project.

```javascript
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
```

### Hash routing

By default, Angular uses a feature called hash routing. If you've ever seen a URL that looks like www.google.com/#/search then you know what I'm talking about. Again, this is personal preference, but I think those are incredibly ugly. To get rid of hash routing, we can enabled $locationProvider.html5Mode. In older browsers that do not support HTML5 routing, Angular will intelligently fall back to hash routing.

Create a file in static/javascripts/ called kpr.config.js and give it the following content:

```javascript
/**
* kpr config
* @namespace kpr.config.js
*/
(function () {
  'use strict';

  angular
    .module('kpr.config')
    .config(config);

  config.$inject = ['$locationProvider'];

  /**
  * @name config
  * @desc Enable HTML5 routing
  */
  function config($locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }
})();
```

Because we are using a new module here, we need to open up static/javascripts/kpr.js, define the module, and include is as a dependency for the kpr module.

```javascript
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
			'kpr.authentication'
	]);

	angular
		.module('kpr.routes', ['ngRoute']);

	angular
		.module('kpr.config', []);

})();
```

### Include new .js files

In this chapter so far, we have already created a number of new JavaScript files. We need to include these in the client by adding them to templates/javascripts.html.

Open templates/javascripts.html

```html5
{% load staticfiles %}

<script type="text/javascript" src="{% static 'bower_components/jquery/dist/jquery.js' %}"></script>

<script type="text/javascript" src="{% static 'bower_components/angular/angular.js' %}"></script>

<script type="text/javascript" src="{% static 'bower_components/angular-route/angular-route.js' %}"></script>

<script type="text/javascript" src="{% static 'bower_components/angular-cookies/angular-cookies.js' %}"></script>

<script type="text/javascript" src="{% static 'bower_components/angular-resource/angular-resource.js' %}"></script>

<script type="text/javascript" src="{% static 'bower_components/materialize/dist/js/materialize.min.js' %}"></script>

<script type="text/javascript" src="{% static 'javascripts/kpr.js' %}"></script>

<script type="text/javascript" src="{% static 'javascripts/kpr.config.js' %}"></script>

<script type="text/javascript" src="{% static 'javascripts/kpr.routes.js' %}"></script>

<script type="text/javascript" src="{% static 'javascripts/authentication/authentication.module.js' %}"></script>

<script type="text/javascript" src="{% static 'javascripts/authentication/services/authentication.service.js' %}"></script>

<script type="text/javascript" src="{% static 'javascripts/authentication/controllers/register.controller.js' %}"></script>

```

### Handling CSRF protection

Because we are using session-based authentication, we have to worry about CSRF protection. We don't go into detail on CSRF here because it's outside the scope of this tutorial, but suffice it to say that CSRF is very bad.

Django, by default, stores a CSRF token in a cookie named csrftoken and expects a header with the name X-CSRFToken for any dangerous HTTP request (POST, PUT, PATCH, DELETE). We can easily configure Angular to handle this.

Open up static/javascripts/kpr.js and add the following under your module definitions:

```javascript
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
			'kpr.authentication'
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
```
### Include new .css files

Create a file in /templates/ called stylesheets.html and give it the following content:

```html5
{% load staticfiles %}

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"/>

<link rel="stylesheet" media="screen,projection" type="text/css" href="{% static 'bower_components/materialize/dist/css/materialize.min.css' %}" />

<link rel="stylesheet" media="screen,projection" type="text/css" href="{% static 'bower_components/materialize/dist/css/style.css' %}" />

<link rel="stylesheet" media="screen,projection" type="text/css" href="{% static 'bower_components/materialize/dist/css/prism.css' %}" />

<link rel="stylesheet" type="text/css" href="{% static 'bower_components/materialize/dist/css/icon.css' %}" />
```

### Create the index.html 

Create a file in /templates/ called index.html and give it the following content:

```html5
<!DOCTYPE html>
<html ng-app="kpr">
	<head>

		<title>Postulation Recipes</title>

		<base href="/" />

		{% include 'stylesheets.html' %}
		
	</head>

	<body> 

		<div class="row">

			<div class="col s12 m12 l12" ng-view>



			</div>

		</div>


		{% include 'javascripts.html' %}

	</body>

</html>
```

### Checkpoint

Try registering a new user by running your server ```(python manage.py runserver)```, visiting http://localhost:8000/register in your browser and filling out the form.


### Making the login API view

Open up authentication/views.py and add the following:

```python
import json

from django.contrib.auth import authenticate, login

from rest_framework import status, views
from rest_framework.response import Response

class LoginView(views.APIView):
    def post(self, request, format=None):
        data = json.loads(request.body)

        email = data.get('email', None)
        password = data.get('password', None)

        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)

``` 

### Adding a login API endpoint

Just as we did with AccountViewSet, we need to add a route for LoginView.

Open up kpr/urls.py and add the following URL between ^postulation/ and ^:

```python
from django.conf.urls import url, include
from authentication.views import AccountViewSet, LoginView
from rest_framework.routers import DefaultRouter
from .views import IndexView

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'accounts', AccountViewSet)

urlpatterns = [
    url(r'^postulation/', include(router.urls)),
    url(r'^postulation/login/$', LoginView.as_view(), name='login')
    url('^.*$', IndexView.as_view(), name='index')
]
```

### Authentication Service

Let's add some more methods to our Authentication service. We will do this in two stages. First we will add a login() method and then we will add some utility methods for storing session data in the browser.

Open static/javascripts/authentication/services/authentication.service.js and add the following method to the Authentication object we created earlier:

```javascript
	/**
	* @name login
	* @desc Try to log in with email `email` and password `password`
	* @param {string} email The email entered by the user
	* @param {string} password The password entered by the user
	* @returns {Promise}
	* @memberOf kpr.authentication.services.Authentication
	*/
	function login(email, password) {
		return $http.post('/postulation/login/', {
			email: email, password: password
		});
	}
```

Much like the register() method from before, login() returns makes an AJAX request to our API and returns a promise.

Now let's talk about a few utility methods we need for managing session information on the client.

We want to display information about the currently authenticated user in the navigation bar at the top of the page. This means we will need a way to store the response returned by login(). We will also need a way to retrieve the authenticated user. We need need a way to unauthenticate the user in the browser. Finally, it would be nice to have an easy way to check if the current user is authenticated.

NOTE: Unauthenticating is different from logging out. When a user logs out, we need a way to remove all remaining session data from the client.

Given these requirements, I suggest three methods: getAuthenticatedAccount, isAuthenticated, setAuthenticatedAccount, and unauthenticate.

Let's implement these now. Add each of the following functions to the Authentication service:

```javascript
/**
* Authentication
* @namespace kpr.authentication.services
*/
(function () {
	'use strict';

	angular
		.module('kpr.authentication.services')
		.factory('Authentication', Authentication);

	Authentication.$inject = ['$cookies', '$http'];

	/**
	* @namespace Authentication
	* @returns {Factory}
	*/
	function Authentication($cookies, $http) {
		/**
		* @name Authentication
		* @desc The Factory to be returned
		*/

		var Authentication = {
			getAuthenticatedAccount: getAuthenticatedAccount,
			isAuthenticated: isAuthenticated,
			login: login,
			register: register,
			setAuthenticatedAccount: setAuthenticatedAccount,
			unauthenticate: unauthenticate
		};
	
	return Authentication;

		///////////////////////

		/**
		* @name register
		* @desc Try to register a new user
		* @param {string} username The username entered by the user
		* @param {string} password The password entered by the user
		* @param {string} email The email entered by the user
		* @returns {Promise}
		* @memberOf kpr.authentication.services.Authentication		
		*/

		function register(email, password, username) {
			return $http.post('/postulation/accounts/', {
				username: username,
				password: password,
				email: email
			});
		}

		/**
		* @name login
		* @desc Try to log in with email `email` and password `password`
		* @param {string} email The email entered by the user
		* @param {string} password The password entered by the user
		* @returns {Promise}
		* @memberOf kpr.authentication.services.Authentication
		*/
		function login(email, password) {
			return $http.post('/postulation/login/', {
				email: email, password: password
			});
		}


		/**
		* @name getAuthenticatedAccount
		* @desc Return the currently authenticated account
		* @returns {object|undefined} Account if authenticated, else `undefined`
		* @memberOf kpr.authentication.services.Authentication
		*/
		function getAuthenticatedAccount() {
			
			if (!$cookies.authenticatedAccount) {
				return;
			}

			return JSON.parse($cookies.authenticatedAccount);
		}


		/**
		* @name isAuthenticated
		* @desc Check if the current user is authenticated
		* @returns {boolean} True is user is authenticated, else false.
		* @memberOf kpr.authentication.services.Authentication
		*/
		function isAuthenticated() {
			return !!$cookies.authenticatedAccount;
		}

		/**
		* @name setAuthenticatedAccount
		* @desc Stringify the account object and store it in a cookie
		* @param {Object} user The account object to be stored
		* @returns {undefined}
		* @memberOf kpr.authentication.services.Authentication
		*/
		function setAuthenticatedAccount(account) {
			$cookies.authenticatedAccount = JSON.stringify(account);
		}

		/**
		* @name unauthenticate
		* @desc Delete the cookie where the user object is stored
		* @returns {undefined}
		* @memberOf kpr.authentication.services.Authentication
		*/
		function unauthenticate() {
			delete $cookies.authenticatedAccount;
		}

	}
	
})();
```

### Making a login interface

We now have Authentication.login() to log a user in, so let's create the login form. Open up static/templates/authentication/login.html and add the following HTML:

```html5
<div class="row">

  <form class="col s12" name="kprForm" novalidate role="form" ng-submit="vm.login(kprForm)" >

    <div class="row">
      <h1 class="col s12 m12 l4 push-l4"> Iniciar Sesion </h1>
    </div>
    

    <div class="row"> 
      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">email</i>
        <input class="validate" ng-model="vm.email" name="email" type="email" required />
        <label> Email </label>
        
        <div ng-show="kprForm.$submitted || kprForm.email.$touched">

          <div class="card-panel" ng-show="kprForm.email.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              El Email es requerido
             </p>

          </div>

          <div class="card-panel" ng-show="kprForm.email.$error.email">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              El Email no es valido
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row"> 

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">vpn_key</i>
        <input ng-model="vm.passwd" name="passwd" type="password" class="validate" required pattern="[ñáéíóúA-Za-z 0-9 .]+">
        <label> Contraseña </label>
        
        <div ng-show="kprForm.$submitted || kprForm.passwd.$touched">

          <div class="card-panel" ng-show="kprForm.passwd.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              La Contraseña es requeridad
             </p>

          </div>

        </div>

      </div>

    </div>

    <div ng-if="!!vm.error">
    
      <div class="card-panel col s12 m12 l4 push-l4">
        
        <p> 
          <i class="medium material-icons waves-effect waves-light">
            report_problem
          </i>
          {{vm.error}}
         </p>

      </div>
    
    </div>

    <div class="row">

      <div class="col s12 m12 l4 push-l4"> 
        
        <br><br>
        
        <button type="submit" class="btn-floating blue" ng-disabled="kprForm.$invalid">
          <i class="material-icons">
          add
          </i>
          
        </button>
        Ingresar

        <a href="/" class="btn-floating blue">
          <i class="material-icons">
          power_settings_new
          </i>
          
        </a>

        Cancelar


        <br><br><br><br>

        <div class="row">

          <a href="/register/">
            <i class="material-icons">
            person_pin
            </i>
            ¿ No tienes cuenta ? Registrate 
          </a>

        </div>

            
      </div>

    </div>

  </form>
  
</div>
```

### Controlling the login interface with LoginController

Create a file in static/javascripts/authentication/controllers/ called login.controller.js and add the following contents:

```javascript
/**
* LoginController
* @namespace kpr.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('kpr.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $scope, Authentication) {
    
    var vm = this;

    vm.login = login;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf kpr.authentication.controllers.LoginController
    */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }

    }


    /**
    * @name login
    * @desc Try to log in with email `email` and password `password`
    * @param {string} email The email entered by the user
    * @param {string} password The password entered by the user
    * @returns {Promise}
    * @memberOf kpr.authentication.services.Authentication
    */
    function login(form) {
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
      * @desc Log "Epic failure!" to the console
      */
      function loginErrorFn(data, status, headers, config) {
        vm.error = 'Usuario y/o Contraseña incorrecta';

            /*Clear Fields*/
          vm.email = undefined;
        vm.passwd = undefined;
        form.$setValidity();
        form.$setPristine();
        form.$setUntouched();

        console.error(data);
      }

    }

  }

})();
```

### Back to RegisterController

Taking a step back, let's add a check to RegisterController and redirect the user if they are already authenticated.

Open static/javascripts/authentication/controllers/register.controller.js and add the following just inside the definition of the controller:

```javascript
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
```

### Making a route for the login interface

The next step is to create the client-side route for the login form.

Open up static/javascripts/kpr.routes.js and add a route for the login form:

```javascript
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
		.when('/login', {
			controller: 'LoginController',
			controllerAs: 'vm',
			templateUrl: '/static/templates/authentication/login.html'
		})
		.otherwise({
			redirectTo: '/'
		});

	}

})();
```

### Include new .js files

If you can believe it, we've only created one new JavaScript file since the last time: login.controller.js. Let's add it to javascripts.html with the other JavaScript files:

```
<script type="text/javascript" src="{% static 'javascripts/authentication/controllers/login.controller.js' %}"></script>
``` 

### Making a logout API view

Let's implement the last authentication-related API view.

Open up authentication/views.py and add the following imports and class

```python
class LogoutView(views.APIView):
    
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)

```

### Moving on to the URLs.



Open up kpr/urls.py again and add the following import and URL:

```python
from authentication.views import AccountViewSet, LoginView, LogoutView

urlpatterns = patterns(
    # ...
    url(r'^postulation/logout/$', LogoutView.as_view(), name='logout'),
    #...
)

```

### Logout: AngularJS Service


The final method you need to add to your Authentication service is the logout() method.

Add the following method to the Authentication service in authentication.service.js:

```javascript
    /**
    * @name logout
    * @desc Try to log the user out
    * @returns {Promise}
    * @memberOf kṕr.authentication.services.Authentication
    */
    function logout() {
      return $http.post('/postulation/logout/')
      .then(logoutSuccessFn, logoutErrorFn);

      /**
      * @name logoutSuccessFn
      * @desc Unauthenticate and redirect to index with page reload
      */
      function logoutSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();

        $location.path('/');
      }

      /**
      * @name logoutErrorFn
      * @desc Log "Epic failure!" to the console
      */
      function logoutErrorFn(data, status, headers, config) {
        console.error('Epic failure!');
      }

    }
```

As always, remember to expose logout as part of the Authentication service:

```javascript
var Authentication = {
  getAuthenticatedUser: getAuthenticatedUser,
  isAuthenticated: isAuthenticated,
  login: login,
  logout: logout,
  register: register,
  setAuthenticatedUser: setAuthenticatedUser,
  unauthenticate: unauthenticate
};
```

### Controlling the navigation bar with NavbarController



There will not actually be a LogoutController or logout.html. Instead, the navigation bar already contains a logout link for authenticated users. We will create a NavbarController for handling the logout buttons onclick functionality and we will update the link itself with an ng-click attribute.

Create a file in static/javascripts/layout/controllers/ called navbar.controller.js and add the following to it:

```javascript
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
```

Open static/templates/layout/navbar.html and add an the following content:

```html5
<div ng-controller="NavbarController as vm">

    <ul id="dropdown1" class="dropdown-content">
            <li><a href="/create/post"> Postulaciones </a></li>
            <li><a ng-href="/profile/{{vm.data.username}}">Perfil</a></li>
            <li><a href="javascript:void(0)" ng-click="vm.logout()">Cerrar Sesion</a></li>
    </ul>

    <ul id="dropdown2" class="dropdown-content">
            <li><a href="/create/post"> Postulaciones </a></li>
            <li><a ng-href="/profile/{{vm.data.username}}">Perfil</a></li>
            <li><a href="javascript:void(0)" ng-click="vm.logout()">Cerrar Sesion</a></li>
    </ul>

    <nav class="white" role="navigation">

        <div class="nav-wrapper container">

            <a id="logo-container" class="brand-logo"><img src="/static/img/canaima-banner.png"></a>

            <ul class="right hide-on-med-and-down">

                <li><a href="/"> Inicio </a></li>
                <li><a href="http://gitlab.canaima.softwarelibre.gob.ve/">GitLab</a></li>
                <li><a href="http://canaima.softwarelibre.gob.ve/">Canaima</a></li>
                <li ng-show="!vm.isAuthenticated"><a href="/login/">Iniciar Sesion</a></li>
                <li ng-show="!vm.isAuthenticated"><a href="/register/">Registrate</a></li>
                <li ng-show="vm.data.is_admin"><a href="/register/admin/">Registrar Admin</a></li>
                <li ng-show="vm.isAuthenticated" ><a class="dropdown-button" href="#!" data-activates="dropdown1">{{vm.data.username}}<i class="material-icons right">arrow_drop_down</i></a></li>

            </ul>

            <ul id="nav-mobile" class="side-nav">

                <li><a href="/"> Inicio </a></li>
                <li><a href="http://gitlab.canaima.softwarelibre.gob.ve/">GitLab</a></li>
                <li><a href="http://canaima.softwarelibre.gob.ve/">Canaima</a></li>
                <li ng-show="!vm.isAuthenticated"><a href="/login/">Iniciar Sesion</a></li>
                <li ng-show="!vm.isAuthenticated"><a href="/register/">Registrate</a></li>
                <li ng-show="vm.data.is_admin"><a href="/register/admin/">Registrar Admin</a></li>
                <li ng-show="vm.isAuthenticated"><a class="dropdown-button" href="#!" data-activates="dropdown2">{{vm.data.username}}<i class="material-icons right">arrow_drop_down</i></a></li>
 

            </ul>

            <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>

        </div>

    </nav>

</div>
```

### Layout modules

We need to add a few new modules this time around.

Create a file in static/javascripts/layout/ called layout.module.js and give it the following contents:

```javascript
/**
* layout module
* @namespace layout.module.js
*/
(function () {
  'use strict';

  angular
    .module('kpr.layout', [
      'kpr.layout.controllers'
    ]);

  angular
    .module('kpr.layout.controllers', []);

})();
```

And don't forget to update static/javascripts/kpr.js also:

```javascript
angular
    .module('kpr', [
      'kpr.config',
      'kpr.routes',
      'kpr.authentication',
      'kpr.layout'
    ])
    .run(run);
```

### Including new .js files

This time around there are a couple new JavaScript files to include. Open up javascripts.html and add the following:

```html5
<script type="text/javascript" src="{% static 'javascripts/layout/layout.module.js' %}"></script>
<script type="text/javascript" src="{% static 'javascripts/layout/controllers/navbar.controller.js' %}"></script>
```

### Making a Post model


In this section we will make a new app and create a Post model.


###Making a posts app


First things first: go ahead and create a new app called postulations.

```bash
$ python manage.py startapp postulations
```

Remember: whenever you create a new app you have to add it to the INSTALLED_APPS setting. Open kpr/settings.py and modify it like so:


```python
INSTALLED_APPS = (
    # ...
    'postulations',
)
```

### Making the Post model


After you create the posts app Django made a new file called postulations/models.py. Go ahead and open it up and add the following:

```python
from django.db import models

from authentication.models import Account

class Postulation(models.Model):

  repository = models.URLField('url of reposity of project', max_length=100, unique=True)
  name_postulation = models.CharField('name postulation', max_length=50, unique=True)
  description_postulation = models.TextField('description of the postulation', max_length=100)
  status = models.CharField('status of postulation', max_length=20, default='Recibido')
  author = models.ForeignKey(Account)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    ordering = ('name_postulation',)
      
  
  def __str__(self):
    return self.name_postulation()
```


```python
author = models.ForeignKey(Account)
```

because each Account can have many Post objects, we need to set up a many-to-one relation.

The way to do this in Django is with using a ForeignKey field to associate each Post with a Account.

Django is smart enough to know the foreign key we've set up here should be reversible. That is to say, given a Account, you should be able to access that user's Posts. In Django these Post objects can be accessed through Account.post_set (not Account.posts).

Now that the model exists, don't forget to migrate.

```bash
$ python manage.py makemigrations
$ python manage.py migrate
```

### Serializing the Postulations model



Create a new file in postulations/ called serializers.py and add the following:


```python
from rest_framework import serializers
from authentication.serializers import AccountSerializer
from postulations.models import Postulation

class PostSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Postulation

        fields = ('id', 'author', 'repository', 'name_postulation', 'description_postulation', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PostSerializer, self).get_validation_exclusions()

        return exclusions + ['author']
```

### Making API views for Post objects


The next step in creating Post objects is adding an API endpoint that will handle performing actions on the Post model such as create or update.

Replace the contents of postulations/views.py with the following:

```python
from rest_framework import permissions, viewsets
from rest_framework.response import Response

from postulations.models import Postulation
from postulations.permissions import IsAuthorOfPost
from postulations.serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Postulation.objects.order_by('-created_at')
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfPost(),)

    """
    perform_create. Nosotros simplemente agarramos el usuario asociado 
    a esta solicitud y les hacemos el autor de este post.
    """
    def perform_create(self, serializer):
      instance = serializer.save(author=self.request.user)

      return super(PostViewSet, self).perform_create(serializer)

class AccountPostsViewSet(viewsets.ViewSet):
    queryset = Postulation.objects.select_related('author').all()
    serializer_class = PostSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
```

### Making the IsAuthorOfPost permission


Create permissions.py in the postulations/ directory with the following content:

```python
from rest_framework import permissions

class IsAuthorOfPost(permissions.BasePermission):
    def has_object_permission(self, request, view, post):
        if request.user:
            return post.author == request.user or request.user.is_admin
        return False
```

### Making an API endpoint for posts

With the views created, it's time to add the endpoints to our API.

Open kpr/urls.py and add the following import:


```python
from posts.views import AccountPostsViewSet, PostViewSet

router.register(r'posts', PostViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)

accounts_router.register(r'posts', AccountPostsViewSet)
```

### A module for posts


Let's define the posts modules.

Create a file in static/javascripts/postulations called postulations.module.js and add the following:

```javascript
(function () {
'use strict';

    angular
        .module('kpr.postulations', [
        'kpr.postulations.controllers',
        'kpr.postulations.services'
    ]);

    angular
        .module('kpr.postulations.controllers', []);

    angular
        .module('kpr.postulations.services', []);

})();
```

Remember to add kpr.postulations as a dependency of kpr in kpr.js:

```javascript
angular
    .module('kpr', [
      'kpr.config',
      'kpr.routes',
      'kpr.authentication',
      'kpr.layout',
      'kpr.postulations'
    ])
    .run(run);
```


### Making a Posts service

Before we can render anything, we need to transport data from the server to the client.

Create a file at static/javascripts/postulations/services/ called postulations.service.js and add the following:

```javascript
/**
* Postulations
* @namespace kpr.postulations.services
*/
(function () {
'use strict';

    angular
        .module('kpr.postulations.services')
        .factory('Postulations', Postulations);

    Postulations.$inject = ['$http'];

    /**
    * @namespace postulations
    * @returns {Factory}
    */
    function Postulations($http) {
        
        var Postulations = {
          all: all,
          create: create,
          get: get,
          getPostUser: getPostUser,
          update: update
        };

        return Postulations;

        ////////////////////

        /**
        * @name all
        * @desc Get all postulations
        * @returns {Promise}
        * @memberOf kpr.postulations.services.postulations
        */
        function all() {
            return $http.get('/postulation/posts/');
        }


        /**
        * @name create
        * @desc Create a new Post
        * @param {string} content The content of the new Post
        * @returns {Promise}
        * @memberOf kpr.postulations.services.postulations
        */
        function create(repository, name, descrip){
            return $http.post('/postulation/posts/', {
                repository: repository,
                name_postulation: name,
                description_postulation: descrip
            });
        }


        /**
         * @name getPost
         * @desc Get the postulations of a given user
         * @param {string} id The id to get postulations for
         * @returns {Promise}
         * @memberOf kpr.postulations.services.postulations
         */
        function get(id) {
            return $http.get('/postulation/posts/' + id + '/');
        }

        /**
         * @name getPostUser
         * @desc Get the postulations of a given user
         * @param {string} username The username to get postulations for
         * @returns {Promise}
         * @memberOf kpr.postulations.services.postulations
         */
        function getPostUser(username) {
            return $http.get('/postulation/accounts/' + username + '/posts/');
        }

        /**
        * @name update
        * @desc Update the given postulation
        * @param {Object} postulation The postulation to be updated
        * @returns {Promise}
        * @memberOf kpr.postulations.services.postulation
        */
        function update(postulation) {
            return $http.put('postulation/posts/' + postulation.id + '/', postulation);
        }
        
    }

})();
```

Include this file in javascripts.html:


```html5
<script type="text/javascript" src="{% static 'javascripts/postulations/services/postulations.service.js' %}"></script>
```

### Making an interface for the index page

Create static/templates/layout/index.html with the following contents:

```html5
<div class="row">
    <div class="col s12 m12 l12" ng-include src="'/static/templates/layout/navbar.html'"></div>
</div>

<br><br>

<h5 class="col s12 m10 push-m7 l8 push-l5"> Lista de Recetas de Kit de Servicios </h5> <br><br>

<br><br>

<div class="container">
    <div class="row">
        <div class="col s12 ">
            <table class="bordered">
            
                <thead>

                    <tr>
                        <th data-field="url"> Url </th>
                        <th data-field="nombre"> Nombre </th>
                        <th data-field="descripcion"> Descripción </th>
                        <th data-field="status"> Estatus </th>
                        <th data-field="autor"> Autor </th>
                        <th ng-if="vm.data.is_admin" data-field="actions"> Acciones </th>
                    </tr>

                </thead>

                <div class="row">
                    <div class="col s12 m5 l6">
                        <div class="input-field">
                            <i class="material-icons prefix">search</i>
                            <input id="icon_prefix" type="text" class="validate" ng-model="query" my-enter="escape()">
                            <label for="icon_prefix">Filtrar</label>
                        </div>
                    </div>
                </div>

                <br>

                <tbody>

                    <tr ng-repeat="post in vm.posts | filter:query">

                        <td><span class="title"> {{ post.repository }} </span> </td>
                        <td><span class="title"> {{ post.name_postulation }} </span> </td>
                        <td><span class="title"> {{ post.description_postulation }} </span> </td>
                        <td><span class="title"> {{ post.status }} </span> </td>
                        <td><span class="title"> {{ post.author.email }} </span> </td>
                        <td ng-if="vm.data.is_admin">
                            <a href="/update/post/{{post.id}}"> <i class="small material-icons">settings</i> </a>
                        </td>
                    </tr>

                </tbody>
      
            </table>

        </div>

    </div>

</div>
```

### Controlling the index interface with IndexController

Create a file in static/javascripts/layout/controllers/ called index.controller.js and add the following:

```javascript
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
```

Include this file in javascripts.html:

<script type="text/javascript" src="{% static 'javascripts/layout/controllers/index.controller.js' %}"></script>


### Making a route for the index page


With a controller and template in place, we need to set up a route for the index page.

Open static/javascripts/kpr.routes.js and add the following route:

```javascript
.when('/', {
  controller: 'IndexController',
  controllerAs: 'vm',
  templateUrl: '/static/templates/layout/index.html'
})
```

### Making a template for the post directive

Create static/templates/postulations/post.html with the following content:

```javascript
<div class="row">
    <div class="col s12 m12 l12" ng-include src="'/static/templates/layout/navbar.html'"></div>
</div>

<div class="row">

  <form class="col s12" name="kprForm" novalidate role="form" ng-submit="vm.submit(kprForm)" >

    <div class="row">
      <h1 class="col s12 m12 l4 push-l4"> Propuesta </h1>
    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">account_circle</i>
        <input class="validate"  name="repository" type="text" ng-model="vm.repository" required>
        <label> Url del Repositorio </label>

        <div ng-show="kprForm.$submitted || kprForm.repository.$touched">

          <div class="card-panel" ng-show="kprForm.repository.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              La url del repositorio es requerida
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">description</i>
        <input class="validate" ng-model="vm.name" name="name" type="text" required />
        <label> Nombre de la Receta </label>
        
        <div ng-show="kprForm.$submitted || kprForm.name.$touched">

          <div class="card-panel" ng-show="kprForm.name.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              El nombre de la receta es requerida
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
        <i class="material-icons prefix">comment</i>
            <textarea class="materialize-textarea validate" ng-model="vm.description" name="description" required></textarea>
            <label for="textarea1">Descripción</label>

            <div ng-show="kprForm.$submitted || kprForm.description.$touched">

          <div class="card-panel" ng-show="kprForm.description.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              La descripción es requerida
             </p>

          </div>
        
        </div>

          </div>

      </div>

    

    <div ng-if="!!vm.success">
    
      <div class="card-panel col s12 m12 l4 push-l4">
        
        <p> 
          <i class="medium material-icons waves-effect waves-light">
            thumb_up
          </i>
          {{vm.success}}
         </p>

      </div>
    
    </div>

    <div ng-if="!!vm.error">
    
      <div class="card-panel col s12 m12 l4 push-l4">
        
        <p> 
          <i class="medium material-icons waves-effect waves-light">
            report_problem
          </i>
          {{vm.error}}
         </p>

      </div>
    
    </div>

    <div class="row">
      
      <div class="col s12 m12 l4 push-l4"> 
        
        <br><br>

        <div class="fixed-action-btn horizontal right-align" style="position: relative;">
          
          <a href="#!" class="btn-floating btn-large waves-light">
            <i class="large material-icons">menu</i>
          </a>

          <ul>
            
            <li>

              <button type="submit" class="btn-floating blue" ng-disabled="kprForm.$invalid">
                <i class="material-icons">
                note_add
                </i>
              </button>

              Agregar

            </li>

          </ul>

        </div>

      </div>

    </div>

  </form>
  
</div>
```

### Controlling the new post interface with NewPostController

Create static/javascripts/postulations/controllers/new-post.controller.js with the following content:

```javascript
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
```

Be sure to include new-post.controller.js in javascripts.html:

```html5
<script type="text/javascript" src="{% static 'javascripts/postulations/controllers/new-post.controller.js' %}"></script>
```

### Making the profile modules

We will be creating a service and a couple of controllers relating to user profiles, so let's go ahead and define the modules we will need.

Create static/javascripts/profiles/profiles.module.js with the following content:

```javascript
(function () {
  'use strict';

    angular
        .module('kpr.profiles', [
            'kpr.profiles.controllers',
            'kpr.profiles.services'
    ]);

    angular
        .module('kpr.profiles.controllers', []);

    angular
        .module('kpr.profiles.services', []);

})();
``` 

As always, don't forget to register kpr.profiles as a dependency of kpr in kpr.js

```javascript
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
```

Include this file in javascripts.html:

```html5
<script type="text/javascript" src="{% static 'javascripts/profiles/profiles.module.js' %}"></script>
```

### Making a Profile factory

With the module definitions in place, we are ready to create the Profile service that will communicate with our API.

Create static/javascripts/profiles/services/profile.service.js with the following contents:

```javascript
/**
* Profile
* @namespace kpr.profiles.services
*/
(function () {
  'use strict';

    angular
        .module('kpr.profiles.services')
        .factory('Profile', Profile);

    Profile.$inject = ['$http'];

    /**
    * @namespace Profile
    */
    function Profile($http) {
        /**
        * @name Profile
        * @desc The factory to be returned
        * @memberOf kpr.profiles.services.Profile
        */
        var Profile = {
            destroy: destroy,
            get: get,
            update: update
        };

        return Profile;

        /////////////////////

        /**
        * @name destroy
        * @desc Destroys the given profile
        * @param {Object} profile The profile to be destroyed
        * @returns {Promise}
        * @memberOf kpr.profiles.services.Profile
        */
        function destroy(profile) {
            return $http.delete('/postulation/accounts/' + profile + '/');
        }


        /**
        * @name get
        * @desc Gets the profile for user with username `username`
        * @param {string} username The username of the user to fetch
        * @returns {Promise}
        * @memberOf kpr.profiles.services.Profile
        */
        function get(username) {
            return $http.get('/postulation/accounts/' + username + '/');
        }


        /**
        * @name update
        * @desc Update the given profile
        * @param {Object} profile The profile to be updated
        * @returns {Promise}
        * @memberOf kpr.profiles.services.Profile
        */
        function update(profile) {
            return $http.put('/postulation/accounts/' + profile.username + '/', profile);
        }

    }
})();
```

We aren't doing anything special here. Each of these API calls is a basic CRUD operation, so we get away with not having much code.

Add this file to javascripts.html:

```html5
<script type="text/javascript" src="{% static 'javascripts/profiles/services/profile.service.js' %}"></script>
```

### Controlling the profile interface with ProfileController

The next step is to create the controller that will use the service we just created, along with the Post service, to retrieve the data we want to display.

Create static/javascripts/profiles/controllers/profile-settings.controller.js with the following content:


```javascript
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
```

Include this file in javascripts.html:


```html5
<script type="text/javascript" src="{% static 'javascripts/profiles/controllers/profile-settings.controller.js' %}"></script>
``` 

### Making a route for viewing user profiles

Open static/javascripts/kpr.routes.js and add the following route:

```javascript
.when('/profile/:username', {
      controller: 'ProfileSettingsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/profiles/settings.html'
    })
```

### A template for the settings page

As usual, now that we have the controller we need to make a corresponding template.

Create static/templates/profiles/settings.html with the following content:

```
<div class="row">
    <div class="col s12 m12 l12" ng-include src="'/static/templates/layout/navbar.html'"></div>
</div>

<div class="row">

  <form class="col s12" name="kprForm" novalidate role="form" ng-submit="vm.update(kprForm)" >

    <div class="row"> 
      <h1 class="col s12 m12 l4 push-l4"> Perfil de Usuario </h1>
    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">account_circle</i>
        <input class="validate"  name="username" type="text" ng-model="vm.profile.username" pattern="[ñáéíóúA-Za-z ]+" required>
        <label class="active"> Nombre de Usuario  </label>

        <div ng-show="kprForm.$submitted || kprForm.username.$touched">

          <div class="card-panel" ng-show="kprForm.username.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              Nombre de usuario es requerido
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">email</i>
        <input class="validate" ng-model="vm.profile.email" name="email" type="email" required />
        <label class="active"> Email </label>
        
        <div ng-show="kprForm.$submitted || kprForm.email.$touched">

          <div class="card-panel" ng-show="kprForm.email.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              El email es requerido
             </p>

          </div>

          <div class="card-panel" ng-show="kprForm.email.$error.email">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              El email no es valido
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row"> 

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">vpn_key</i>
        <input ng-model="vm.passwd" name="passwd" type="password" class="validate" required pattern="[ñáéíóúA-Za-z 0-9 .]+">
        <label> Contraseña </label>
        
        <div ng-show="kprForm.$submitted || kprForm.passwd.$touched">

          <div class="card-panel" ng-show="kprForm.passwd.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              La Contraseña es requerida
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row"> 

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">vpn_key</i>
        <input ng-model="vm.confpass" name="pass" type="password" class="validate" required pattern="[ñáéíóúA-Za-z 0-9 .]+">
        <label> Confirmar contraseña </label>
        
        <div ng-show="kprForm.$submitted || kprForm.pass.$touched">

          <div class="card-panel" ng-show="kprForm.pass.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              Debe Confirmar la contraseña
             </p>

          </div>

        </div>

        <div ng-show="kprForm.$submitted || kprForm.pass.$touched">

          <div class="card-panel" ng-if="vm.confpass !== vm.passwd">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              Las contraseñas no coinciden 
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">account_circle</i>
        <input class="validate"  name="first_name" type="text" ng-model="vm.profile.first_name" pattern="[ñáéíóúA-Za-z ]+">
        <label class="active"> Primer Nombre </label>

        <div ng-show="kprForm.$submitted || kprForm.first_name.$touched">

          <div class="card-panel" ng-show="kprForm.first_name.$error.pattern">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              Solo las letras estan permitidas
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">account_circle</i>
        <input class="validate"  name="last_name" type="text" ng-model="vm.profile.last_name" pattern="[ñáéíóúA-Za-z ]+">
        <label class="active"> Apellidos </label>

        <div ng-show="kprForm.$submitted || kprForm.last_name.$touched">

          <div class="card-panel" ng-show="kprForm.last_name.$error.pattern">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              Solo las letras estan permitidas
             </p>

          </div>

        </div>

      </div>

    </div>
    
    <div ng-if="!!vm.success">
    
      <div class="card-panel col s12 m12 l4 push-l4">
        
        <p> 
          <i class="medium material-icons waves-effect waves-light">
            thumb_up
          </i>
          {{vm.success}}
         </p>

      </div>
    
    </div>

    <div ng-if="!!vm.profile.error">
    
      <div class="card-panel col s12 m12 l4 push-l4">
        
        <p> 
          <i class="medium material-icons waves-effect waves-light">
            report_problem
          </i>
          {{vm.error}}
         </p>

      </div>
    
    </div>


    <div class="row">

      <div class="col s12 m12 l4 push-l4"> 
        
        <br><br>

        <div class="fixed-action-btn horizontal right-align" style="position: relative;">
          
          <a href="#!" class="btn-floating btn-large waves-light">
            <i class="large material-icons">menu</i>
          </a>

          <ul>
            
            <li>

              <button type="submit" class="btn-floating light-blue accent-3" ng-disabled="kprForm.$invalid">
                <i class="material-icons">
                settings
                </i>

                

              </button>

              Actualizar Perfil

            </li>

            <li>

              <button type="submit" class="btn-floating pink darken-1" ng-click="vm.destroy()">
                <i class="material-icons">
                delete
                </i>
                
                

              </button>

              Eliminar Perfil

            </li>

          </ul>

        </div>

      </div>

    </div>

  </form>
  
</div>
```


### Updating posts 

Add new service to admin can update the status of postulation, in the file static/javascripts/postulations/services/postulations.services.js copy the next content:

```javascript
/**
* Postulations
* @namespace kpr.postulations.services
*/
(function () {
'use strict';

    angular
        .module('kpr.postulations.services')
        .factory('Postulations', Postulations);

    Postulations.$inject = ['$http'];

    /**
    * @namespace postulations
    * @returns {Factory}
    */
    function Postulations($http) {
        
        var Postulations = {
          all: all,
          create: create,
          get: get,
          getPostUser: getPostUser,
          update: update
        };

        return Postulations;

        ////////////////////

        /**
        * @name all
        * @desc Get all postulations
        * @returns {Promise}
        * @memberOf kpr.postulations.services.postulations
        */
        function all() {
            return $http.get('/postulation/posts/');
        }


        /**
        * @name create
        * @desc Create a new Post
        * @param {string} content The content of the new Post
        * @returns {Promise}
        * @memberOf kpr.postulations.services.postulations
        */
        function create(repository, name, descrip){
            return $http.post('/postulation/posts/', {
                repository: repository,
                name_postulation: name,
                description_postulation: descrip
            });
        }


        /**
         * @name getPost
         * @desc Get the postulations of a given user
         * @param {string} id The id to get postulations for
         * @returns {Promise}
         * @memberOf kpr.postulations.services.postulations
         */
        function get(id) {
            return $http.get('/postulation/posts/' + id + '/');
        }

        /**
         * @name getPostUser
         * @desc Get the postulations of a given user
         * @param {string} username The username to get postulations for
         * @returns {Promise}
         * @memberOf kpr.postulations.services.postulations
         */
        function getPostUser(username) {
            return $http.get('/postulation/accounts/' + username + '/posts/');
        }

        /**
        * @name update
        * @desc Update the given postulation
        * @param {Object} postulation The postulation to be updated
        * @returns {Promise}
        * @memberOf kpr.postulations.services.postulation
        */
        function update(postulation) {
            return $http.put('postulation/posts/' + postulation.id + '/', postulation);
        }
        
    }

})();
```
### Controlling the post interface with PostSettingsController


Create a file in static/javascripts/postulations/controllers/post-settings.controller.js with the following content :

```javascript
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
```

A template for the posts settings page

As usual, now that we have the controller we need to make a corresponding template.

Create static/templates/postulations/post-update.html with the following content:

```html5
<div class="row">
    <div class="col s12 m12 l12" ng-include src="'/static/templates/layout/navbar.html'"></div>
</div>

<div class="row">

  <form class="col s12" name="kprForm" novalidate role="form" ng-submit="vm.update(kprForm)" >

    <div class="row">
      <h1 class="col s12 m12 l4 push-l4"> Propuesta </h1>
    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">account_circle</i>
        <input class="validate"  name="repository" type="text" ng-model="vm.post.repository" required>
        <label class="active"> Url del Repositorio </label>

        <div ng-show="kprForm.$submitted || kprForm.repository.$touched">

          <div class="card-panel" ng-show="kprForm.repository.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              La url del repositorio es requerida
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">description</i>
        <input class="validate" ng-model="vm.post.name_postulation" name="name" type="text" required />
        <label class="active"> Nombre de la Receta </label>
        
        <div ng-show="kprForm.$submitted || kprForm.name.$touched">

          <div class="card-panel" ng-show="kprForm.name.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              El nombre de la receta es requerida
             </p>

          </div>

        </div>

      </div>

    </div>

    <div class="row">

      <div class="input-field col s12 m12 l4 push-l4">
        <i class="material-icons prefix">comment</i>
            <textarea class="materialize-textarea validate" ng-model="vm.post.description_postulation" name="description" required></textarea>
            <label class="active" for="textarea1">Descripción</label>

            <div ng-show="kprForm.$submitted || kprForm.description.$touched">

          <div class="card-panel" ng-show="kprForm.description.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              La descripción es requerida
             </p>

          </div>
        
        </div>

          </div>

        </div>

        <div class="row">

          <div class="input-field col s12 m12 l4 push-l4">
                
        <i class="material-icons prefix">description</i>
        <input class="validate" ng-model="vm.post.status" name="status" type="text" required />
        <label class="active"> Estatus </label>
        
        <div ng-show="kprForm.$submitted || kprForm.status.$touched">

          <div class="card-panel" ng-show="kprForm.status.$error.required">
        
            <p> 
              <i class="medium material-icons waves-effect waves-light">
                report_problem
              </i>
              Estatus requerido
             </p>

          </div>

        </div>

      </div>

    </div>

    

    <div ng-if="!!vm.success">
    
      <div class="card-panel col s12 m12 l4 push-l4">
        
        <p> 
          <i class="medium material-icons waves-effect waves-light">
            thumb_up
          </i>
          {{vm.success}}
         </p>

      </div>
    
    </div>

    <div ng-if="!!vm.error">
    
      <div class="card-panel col s12 m12 l4 push-l4">
        
        <p> 
          <i class="medium material-icons waves-effect waves-light">
            report_problem
          </i>
          {{vm.error}}
         </p>

      </div>
    
    </div>

    <div class="row">

      <div class="col s12 m12 l4 push-l4"> 
        
        <br><br>

        <div class="fixed-action-btn horizontal right-align" style="position: relative;">
          
          <a href="#!" class="btn-floating btn-large waves-light">
            <i class="large material-icons">menu</i>
          </a>

          <ul>
            
            <li>

              <button type="submit" class="btn-floating red" ng-disabled="kprForm.$invalid">
                <i class="material-icons">
                settings
                </i>
              </button>
              Actualizar

            </li>

          </ul>

        </div>

      </div>

    </div>

  </form>
  
</div>
```

### Making a route for viewing post settings

Open static/javascripts/kpr.routes.js and add the following route:

```javasript
  .when('/update/post/:id', {
      controller: 'PostSettingsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/postulations/post-update.html'
    })
```

It is this point we have finished all the functionality that implementation

### Now we will package the application will generate a .deb 

Firts create a file kit-postulation/AUTHORS with the following content:

```bash
Victor Pino <victopin0@gmail.com>
```

Now create a file kit-postulation/COPYING with thw following content:

```bash
kit-postulation is

   Copyright (C) Victor Pino <victopin0@gmail.com>

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.
     
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
    
   You should have received a copy of the GNU General Public License
   along with this program; if not, write to:

        Free Software Foundation, Inc. 
  51 Franklin St, Fifth Floor
  Boston, MA 02110-1301, USA.

On Debian GNU/Linux systems, the complete text of the GNU General Public
License can be found in the /usr/share/common-licenses' directory.
```

Create a file kit-postulation/LICENSE with thw following content:

```bash
                    GNU GENERAL PUBLIC LICENSE
                       Version 2, June 1991

 Copyright (C) 1989, 1991 Free Software Foundation, Inc., <http://fsf.org/>
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The licenses for most software are designed to take away your
freedom to share and change it.  By contrast, the GNU General Public
License is intended to guarantee your freedom to share and change free
software--to make sure the software is free for all its users.  This
General Public License applies to most of the Free Software
Foundation's software and to any other program whose authors commit to
using it.  (Some other Free Software Foundation software is covered by
the GNU Lesser General Public License instead.)  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
this service if you wish), that you receive source code or can get it
if you want it, that you can change the software or use pieces of it
in new free programs; and that you know you can do these things.

  To protect your rights, we need to make restrictions that forbid
anyone to deny you these rights or to ask you to surrender the rights.
These restrictions translate to certain responsibilities for you if you
distribute copies of the software, or if you modify it.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must give the recipients all the rights that
you have.  You must make sure that they, too, receive or can get the
source code.  And you must show them these terms so they know their
rights.

  We protect your rights with two steps: (1) copyright the software, and
(2) offer you this license which gives you legal permission to copy,
distribute and/or modify the software.

  Also, for each author's protection and ours, we want to make certain
that everyone understands that there is no warranty for this free
software.  If the software is modified by someone else and passed on, we
want its recipients to know that what they have is not the original, so
that any problems introduced by others will not reflect on the original
authors' reputations.

  Finally, any free program is threatened constantly by software
patents.  We wish to avoid the danger that redistributors of a free
program will individually obtain patent licenses, in effect making the
program proprietary.  To prevent this, we have made it clear that any
patent must be licensed for everyone's free use or not licensed at all.

  The precise terms and conditions for copying, distribution and
modification follow.

                    GNU GENERAL PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. This License applies to any program or other work which contains
a notice placed by the copyright holder saying it may be distributed
under the terms of this General Public License.  The "Program", below,
refers to any such program or work, and a "work based on the Program"
means either the Program or any derivative work under copyright law:
that is to say, a work containing the Program or a portion of it,
either verbatim or with modifications and/or translated into another
language.  (Hereinafter, translation is included without limitation in
the term "modification".)  Each licensee is addressed as "you".

Activities other than copying, distribution and modification are not
covered by this License; they are outside its scope.  The act of
running the Program is not restricted, and the output from the Program
is covered only if its contents constitute a work based on the
Program (independent of having been made by running the Program).
Whether that is true depends on what the Program does.

  1. You may copy and distribute verbatim copies of the Program's
source code as you receive it, in any medium, provided that you
conspicuously and appropriately publish on each copy an appropriate
copyright notice and disclaimer of warranty; keep intact all the
notices that refer to this License and to the absence of any warranty;
and give any other recipients of the Program a copy of this License
along with the Program.

You may charge a fee for the physical act of transferring a copy, and
you may at your option offer warranty protection in exchange for a fee.

  2. You may modify your copy or copies of the Program or any portion
of it, thus forming a work based on the Program, and copy and
distribute such modifications or work under the terms of Section 1
above, provided that you also meet all of these conditions:

    a) You must cause the modified files to carry prominent notices
    stating that you changed the files and the date of any change.

    b) You must cause any work that you distribute or publish, that in
    whole or in part contains or is derived from the Program or any
    part thereof, to be licensed as a whole at no charge to all third
    parties under the terms of this License.

    c) If the modified program normally reads commands interactively
    when run, you must cause it, when started running for such
    interactive use in the most ordinary way, to print or display an
    announcement including an appropriate copyright notice and a
    notice that there is no warranty (or else, saying that you provide
    a warranty) and that users may redistribute the program under
    these conditions, and telling the user how to view a copy of this
    License.  (Exception: if the Program itself is interactive but
    does not normally print such an announcement, your work based on
    the Program is not required to print an announcement.)

These requirements apply to the modified work as a whole.  If
identifiable sections of that work are not derived from the Program,
and can be reasonably considered independent and separate works in
themselves, then this License, and its terms, do not apply to those
sections when you distribute them as separate works.  But when you
distribute the same sections as part of a whole which is a work based
on the Program, the distribution of the whole must be on the terms of
this License, whose permissions for other licensees extend to the
entire whole, and thus to each and every part regardless of who wrote it.

Thus, it is not the intent of this section to claim rights or contest
your rights to work written entirely by you; rather, the intent is to
exercise the right to control the distribution of derivative or
collective works based on the Program.

In addition, mere aggregation of another work not based on the Program
with the Program (or with a work based on the Program) on a volume of
a storage or distribution medium does not bring the other work under
the scope of this License.

  3. You may copy and distribute the Program (or a work based on it,
under Section 2) in object code or executable form under the terms of
Sections 1 and 2 above provided that you also do one of the following:

    a) Accompany it with the complete corresponding machine-readable
    source code, which must be distributed under the terms of Sections
    1 and 2 above on a medium customarily used for software interchange; or,

    b) Accompany it with a written offer, valid for at least three
    years, to give any third party, for a charge no more than your
    cost of physically performing source distribution, a complete
    machine-readable copy of the corresponding source code, to be
    distributed under the terms of Sections 1 and 2 above on a medium
    customarily used for software interchange; or,

    c) Accompany it with the information you received as to the offer
    to distribute corresponding source code.  (This alternative is
    allowed only for noncommercial distribution and only if you
    received the program in object code or executable form with such
    an offer, in accord with Subsection b above.)

The source code for a work means the preferred form of the work for
making modifications to it.  For an executable work, complete source
code means all the source code for all modules it contains, plus any
associated interface definition files, plus the scripts used to
control compilation and installation of the executable.  However, as a
special exception, the source code distributed need not include
anything that is normally distributed (in either source or binary
form) with the major components (compiler, kernel, and so on) of the
operating system on which the executable runs, unless that component
itself accompanies the executable.

If distribution of executable or object code is made by offering
access to copy from a designated place, then offering equivalent
access to copy the source code from the same place counts as
distribution of the source code, even though third parties are not
compelled to copy the source along with the object code.

  4. You may not copy, modify, sublicense, or distribute the Program
except as expressly provided under this License.  Any attempt
otherwise to copy, modify, sublicense or distribute the Program is
void, and will automatically terminate your rights under this License.
However, parties who have received copies, or rights, from you under
this License will not have their licenses terminated so long as such
parties remain in full compliance.

  5. You are not required to accept this License, since you have not
signed it.  However, nothing else grants you permission to modify or
distribute the Program or its derivative works.  These actions are
prohibited by law if you do not accept this License.  Therefore, by
modifying or distributing the Program (or any work based on the
Program), you indicate your acceptance of this License to do so, and
all its terms and conditions for copying, distributing or modifying
the Program or works based on it.

  6. Each time you redistribute the Program (or any work based on the
Program), the recipient automatically receives a license from the
original licensor to copy, distribute or modify the Program subject to
these terms and conditions.  You may not impose any further
restrictions on the recipients' exercise of the rights granted herein.
You are not responsible for enforcing compliance by third parties to
this License.

  7. If, as a consequence of a court judgment or allegation of patent
infringement or for any other reason (not limited to patent issues),
conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot
distribute so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you
may not distribute the Program at all.  For example, if a patent
license would not permit royalty-free redistribution of the Program by
all those who receive copies directly or indirectly through you, then
the only way you could satisfy both it and this License would be to
refrain entirely from distribution of the Program.

If any portion of this section is held invalid or unenforceable under
any particular circumstance, the balance of the section is intended to
apply and the section as a whole is intended to apply in other
circumstances.

It is not the purpose of this section to induce you to infringe any
patents or other property right claims or to contest validity of any
such claims; this section has the sole purpose of protecting the
integrity of the free software distribution system, which is
implemented by public license practices.  Many people have made
generous contributions to the wide range of software distributed
through that system in reliance on consistent application of that
system; it is up to the author/donor to decide if he or she is willing
to distribute software through any other system and a licensee cannot
impose that choice.

This section is intended to make thoroughly clear what is believed to
be a consequence of the rest of this License.

  8. If the distribution and/or use of the Program is restricted in
certain countries either by patents or by copyrighted interfaces, the
original copyright holder who places the Program under this License
may add an explicit geographical distribution limitation excluding
those countries, so that distribution is permitted only in or among
countries not thus excluded.  In such case, this License incorporates
the limitation as if written in the body of this License.

  9. The Free Software Foundation may publish revised and/or new versions
of the General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

Each version is given a distinguishing version number.  If the Program
specifies a version number of this License which applies to it and "any
later version", you have the option of following the terms and conditions
either of that version or of any later version published by the Free
Software Foundation.  If the Program does not specify a version number of
this License, you may choose any version ever published by the Free Software
Foundation.

  10. If you wish to incorporate parts of the Program into other free
programs whose distribution conditions are different, write to the author
to ask for permission.  For software which is copyrighted by the Free
Software Foundation, write to the Free Software Foundation; we sometimes
make exceptions for this.  Our decision will be guided by the two goals
of preserving the free status of all derivatives of our free software and
of promoting the sharing and reuse of software generally.

                            NO WARRANTY

  11. BECAUSE THE PROGRAM IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY
FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW.  EXCEPT WHEN
OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES
PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED
OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.  THE ENTIRE RISK AS
TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU.  SHOULD THE
PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING,
REPAIR OR CORRECTION.

  12. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR
REDISTRIBUTE THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES,
INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING
OUT OF THE USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED
TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY
YOU OR THIRD PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER
PROGRAMS), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE
POSSIBILITY OF SUCH DAMAGES.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
convey the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    {description}
    Copyright (C) {year}  {fullname}

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

Also add information on how to contact you by electronic and paper mail.

If the program is interactive, make it output a short notice like this
when it starts in an interactive mode:

    Gnomovision version 69, Copyright (C) year name of author
    Gnomovision comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.

The hypothetical commands `show w' and `show c' should show the appropriate
parts of the General Public License.  Of course, the commands you use may
be called something other than `show w' and `show c'; they could even be
mouse-clicks or menu items--whatever suits your program.

You should also get your employer (if you work as a programmer) or your
school, if any, to sign a "copyright disclaimer" for the program, if
necessary.  Here is a sample; alter the names:

  Yoyodyne, Inc., hereby disclaims all copyright interest in the program
  `Gnomovision' (which makes passes at compilers) written by James Hacker.

  {signature of Ty Coon}, 1 April 1989
  Ty Coon, President of Vice

This General Public License does not permit incorporating your program into
proprietary programs.  If your program is a subroutine library, you may
consider it more useful to permit linking proprietary applications with the
library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.
```

Create a folder kit-postulation/debian

Now create a file kit-postulation/debian/compat with the following content:

```bash
9
```

Create a file kit-postulation/debian/preinst with following content:

```bash
#!/bin/bash -e
#
# ==============================================================================
# PAQUETE: kit-postulation
# ARCHIVO: preinst
# DESCRIPCIÓN: Configura el sistema antes de la instalación del paquete.
# COPYRIGHT:
#  (C) 2015 Victor Pino <victopin0@gmail.com>
# LICENCIA: GPL3
# ==============================================================================
#
# Este programa es software libre. Puede redistribuirlo y/o modificarlo bajo los
# términos de la Licencia Pública General de GNU (versión 3).

case ${1} in

    install|upgrade)
        
  #Si el servicio de apache esta activo lo detenemos para poner correr el server de nginx
  service apache2 stop || true 
  
    ;;

    abort-upgrade|abort-install)

     

    ;;

    *)
            echo "preinst no reconoce el argumento '"${1}"'" >&2
            exit 1
    ;;

esac

#DEBHELPER#

exit 0
```

This script Configures the system before installing the package.


Create a file kit-postulation/debian/postinst with following content:

```bash
#!/bin/bash -e
#
# ==============================================================================
# PAQUETE: kit-postulation
# ARCHIVO: postinst
# DESCRIPCIÓN: Configura el sistema despues la instalación del paquete.
# COPYRIGHT:
#  (C) 2015 Victor Pino <victopin0@gmail.com>
# LICENCIA: GPL3
# ==============================================================================
#
# Este programa es software libre. Puede redistribuirlo y/o modificarlo bajo los
# términos de la Licencia Pública General de GNU (versión 3).

case ${1} in

    configure)
  
  #Luego que se instala la aplicacion se reinician el nginx y uwsgi
  service nginx restart || true 
  service uwsgi restart || true 


    ;;

        abort-upgrade|abort-remove|abort-deconfigure)

        ;;

        *)

                echo "postinst no reconoce el argumento '"${1}"'" >&2
                exit 1

        ;;

esac

#DEBHELPER#

exit 0
```

this script Configures the system after installing the package.

Create a file kit-postulation/debian/prerm with following content:

```bash
#!/bin/bash -e
#
# ==============================================================================
# PAQUETE: kit-postulation
# ARCHIVO: prerm
# DESCRIPCIÓN: Prepara el sistema para que el paquete sea removido.
# COPYRIGHT:
#  (C) 2015 Victor Pino <victopin0@gmail.com>
# LICENCIA: GPL3
# ==============================================================================
#
# Este programa es software libre. Puede redistribuirlo y/o modificarlo bajo los
# términos de la Licencia Pública General de GNU (versión 3).

case ${1} in

    remove|upgrade|deconfigure)
  
    #Detenemos los servicios de nginx y uwsgi para que la aplicacion pueda ser eliminada
    service nginx stop
    service uwsgi stop

    ;;

    failed-upgrade)

    ;;

    *)

        echo "prerm no reconoce el argumento '"${1}"'" >&2
        exit 1
    ;;

esac

#DEBHELPER#

exit 0
```

Prepares the system for the package is removed.

Create a file kit-postulation/debian/rules with following content:

```javascript
#!/usr/bin/make -f

%:
  dh $@ --with python-virtualenv

```

This script it contains a delhelper that create a virtualenv with the requirements that you give


Create a file kit-postulation/debian/install with the following content:

```bash
etc
``` 

This file it contains the path of  directory that you want is when install the package.

Create a file kit-postulation/debian/install with the following:

```bash
/etc/nginx/sites-available/kit-postulation.nginx.conf /etc/nginx/sites-enabled/kit-postulation.nginx.conf
/etc/uwsgi/apps-available/kit-postulation.uwsgi.ini /etc/uwsgi/apps-enabled/kit-postulation.uwsgi.ini
```

The file it contains symlink

Create a file kit-postulation/debian/control with the following:

```bash
Source: kit-postulation
Section: web
Priority: standard
Maintainer: Victor Pino <victopin0@gmail.com>
Build-Depends: debhelper (>= 9.20150101), cdbs (>= 0.4.130), dh-virtualenv (>= 0.7), python-setuptools, libpq-dev, python-all-dev
Standards-Version: 3.9.6
Homepage: http://canaima.softwarelibre.gob.ve/

Package: kit-postulation
Architecture: any
Pre-Depends: dpkg (>= 1.16.1), python2.7 | python2.6, ${misc:Pre-Depends}
Depends: virtualenv, nginx, uwsgi, uwsgi-plugin-python, python-setuptools, ${python:Depends}, ${misc:Depends}
Description: Servicio de apis
 kit-postulation es una aplicacion hecha en django
 la cual provee información mediantes apis.
```

Create a file kit-postulation/debian/source/format with the following content:

```bash
3.0 (native)
```

Create a file kit-postulation/debian/copyright with the following content:

```bash
kit-postulation is

   Copyright (C) Victor Pino <victopin0@gmail.com>
   
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.
     
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
    
   You should have received a copy of the GNU General Public License
   along with this program; if not, write to:

        Free Software Foundation, Inc. 
  51 Franklin St, Fifth Floor
  Boston, MA 02110-1301, USA.

On Debian GNU/Linux systems, the complete text of the GNU General Public
License can be found in the /usr/share/common-licenses' directory.
```


Now create 2 files to server of nginx and uwsgi

create file kit-postulation/etc/nginx/sites-available/kit-postulation.nginx.conf

```bash
upstream uwsgi {
        server     127.0.0.1:8001;
}

server {
        listen         80;
        server_name    kit-postulation.canaima.gob.ve;
        charset        utf-8;

        location /static {
                alias    /usr/share/python/kit-postulation/lib/python2.7/site-packages/kpr/static;
        }

        location / {
                uwsgi_pass    uwsgi;
                include   /etc/nginx/uwsgi_params;
        }
}
```

create file kit-postulation/etc/uwsgi/apps-available/kit-postulation.uwsgi.ini with the following content:

```bash
[uwsgi]
home            = /usr/share/python/kit-postulation/
chdir           = /usr/share/python/kit-postulation/lib/python2.7/site-packages/kpr/
wsgi-file       = /usr/share/python/kit-postulation/lib/python2.7/site-packages/kpr/kpr/wsgi.py
logto           = /var/log/kit-postulation/uwsgi.log
socket          = 127.0.0.1:8001
plugin          = python
```

Now to config virtualenv create a file kit-postulation/setup.py with following content:

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Copyright (C) 2016 Victor Pino <victopin0@gmail.com>
#
# This file is part of kit-postulation.
#
# kit-postulation is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# kit-postulation is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import os
from setuptools import setup

with open(os.path.join(os.path.dirname(__file__), 'README.md')) as readme:
    README = readme.read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name="kit-postulation",
    packages=['kpr'],
    version="0.1",
    install_requires=[
        "django == 1.10.1"
    ],
    zip_safe=False,
    long_description=README,
    include_package_data=True,
    license='BSD License',  # example license
    description='A simple Django app to controlling Recipes.',
    url='http://gitlab.canaima.softwarelibre.gob.ve/canaima-gnu-linux/kit-postulation',
    author='Victor Pino',
    author_email='victopin0@gmail.com',
)
```


And to finish create a file kit-postulation/MANIFEST.in with the following content:

```bash
include LICENSE
include README.md
recursive-include kpr *
recursive-exclude debian *
recursive-exclude etc *
```

This file is used to specify to the file setup.py that will include and what not


### !! And finish now to create you package of debian execute the following:

```bash
debuild -us -uc
``` 

#### Sources:

[https://thinkster.io/django-angularjs-tutorial]
