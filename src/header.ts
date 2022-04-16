import * as ng from 'angular';

ng.module('app')
    .controller('headerCtrl', ['$scope',
        function ($scope) {
            $scope.info = {
            };
        }]);