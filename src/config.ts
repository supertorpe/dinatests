import 'angular';
import 'angular-route';
import * as ng from 'angular';

ng.module('app', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider',
        ($routeProvider: ng.route.IRouteProvider,
            $locationProvider: ng.ILocationProvider) => {
            const homeRoute: ng.route.IRoute = {
                templateUrl: 'home.html',
                controller: 'homeCtrl'
            };
            const tokenRoute: ng.route.IRoute = {
                templateUrl: 'token.html',
                controller: 'tokenCtrl'
            };
            const testNewRoute: ng.route.IRoute = {
                templateUrl: 'test.html',
                controller: 'testNewCtrl'
            };
            const testEditRoute: ng.route.IRoute = {
                templateUrl: 'test.html',
                controller: 'testEditCtrl'
            };
            const quizRoute: ng.route.IRoute = {
                templateUrl: 'quiz.html',
                controller: 'quizCtrl'
            };
            const exploreRoute: ng.route.IRoute = {
                templateUrl: 'explore.html',
                controller: 'exploreCtrl'
            };
            $routeProvider
                .when('/', homeRoute)
                .when('/home', homeRoute)
                .when('/token', tokenRoute)
                .when('/test/new', testNewRoute)
                .when('/test/edit/:id', testEditRoute)
                .when('/quiz', quizRoute)
                .when('/explore', exploreRoute)
                .otherwise({
                    redirectTo: '/'
                });
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            });
        }]);
