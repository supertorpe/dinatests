import * as ng from 'angular';

if (localStorage['THEME'] == 'dark') document.querySelector('body')?.classList.add('dark');

ng.module('app')
    .controller('settingsCtrl', ['$scope', 'tokenService', 'clipboard',
        function ($scope, tokenService, clipboard) {
            $scope.info = {
            };
            $scope.changeTheme = () => {
                if (document.querySelector('body')?.classList.contains('dark')) {
                    document.querySelector('body')?.classList.remove('dark');
                    localStorage['THEME'] = 'light';
                } else {
                    document.querySelector('body')?.classList.add('dark');
                    localStorage['THEME'] = 'dark';
                }
            };
            $scope.copyToken = () => {
                clipboard.copy(tokenService.getLocalToken());
            };
        }]);
