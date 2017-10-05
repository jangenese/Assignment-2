var app = angular.module('assignment2App', ['ui.router', 'ngMaterial', 'ngMessages', 'ngSanitize', 'angular-jwt']);




app.factory('authInterceptor', function($rootScope, $q, $window, jwtHelper) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                
               
                $rootScope.isAuthenticated = true;
            }
            else {

                console.log('No User Present');
                window.location = '/#/home';
            }
            return config;
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {

            }
            return $q.reject(rejection);
        }
    };
});





app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    
    


    $httpProvider.interceptors.push('authInterceptor');
    
  

    $urlRouterProvider.otherwise('/home');

    $stateProvider



        .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'loginController'
    }).state('dashboard', {
        url: '/dashboard',
        views: {
            '': {
                templateUrl: 'views/dashboard.html',
                controller: 'dashboardController',
                data: {
                    isAuthenticated: true
                }
            },
            'books@dashboard': {
                templateUrl: 'views/partials/books.html',
                controller: 'booksController',

                data: {
                    isAuthenticated: true
                }
            },
            'messages@dashboard': {
                templateUrl: 'views/partials/messages.html',
                controller: 'messagesController',

                data: {
                    isAuthenticated: true
                }
            },
            'todos@dashboard': {
                templateUrl: 'views/partials/todos.html',
                controller: 'todosController',

                data: {
                    isAuthenticated: true
                }
            },
            'nav@dashboard': {
                templateUrl: 'views/partials/nav.html',
                controller: 'navController',

                data: {
                    isAuthenticated: true
                }
            }
        }
    }).state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'aboutController',
        data: {
            isAuthenticated: true
        }
    });

});
