import * as ng from 'angular';

declare var grecaptcha: any;

ng.module('app')
    .controller('tokenCtrl', ['$scope', '$location', '$timeout', '$window', 'alertService', 'tokenService', 'clipboard',
        function ($scope, $location: ng.ILocationService, $timeout: ng.ITimeoutService, $window: ng.IWindowService, alertService, tokenService, clipboard) {
            $scope.info = {
                title: 'Token',
                error: null,
                token: null
            }
            $timeout(() => {
                const inputMyToken = document.querySelector('ion-input > input[name=\'myToken\']') as HTMLInputElement;
                inputMyToken.addEventListener('input', (_ev: Event) => {
                    const ie = _ev as InputEvent;
                    const inputText = (ie.target as HTMLInputElement);
                    $scope.info.token = inputText.value;
                    $scope.$apply();
                });
            }, 100);

            $scope.btnGenTokenClick = () => {
                grecaptcha.reset();
                grecaptcha.execute();
            };

            $window.checkCaptcha = () => {
                const response = grecaptcha.getResponse();
                if (!response) return;
                tokenService.sendToken(response, null)
                    .then((value: ng.IHttpResponse<any>) => {
                        if (value.status == 200 && value.data && value.data.status == 'OK') {
                            tokenService.setLocalToken(value.data.data);
                            $scope.info.token = value.data.data;
                            (document.querySelector('ion-input[name=\'myToken\']') as HTMLInputElement).value = value.data.data;
                        } else {
                            alertService.show('Aviso', value.data.message);
                        }
                    });
            };

            const script = document.createElement('script') as HTMLScriptElement;
            script.type = 'text/javascript';
            //script.onload = () => { };
            script.src = 'https://www.google.com/recaptcha/api.js?hl=es';
            document.getElementsByTagName('head')[0].appendChild(script);

            $scope.btnCopyClick = () => {
                tokenService.sendToken(null, $scope.info.token)
                    .then((value: ng.IHttpResponse<any>) => {
                        if (value.status == 200 && value.data && value.data.status == 'OK') {
                            clipboard.copy($scope.info.token);
                        } else {
                            alertService.show('Aviso', 'El Token no es válido');
                        }
                    });
            };
            $scope.btnContinueClick = () => {
                tokenService.sendToken(null, $scope.info.token)
                    .then((value: ng.IHttpResponse<any>) => {
                        if (value.status == 200 && value.data && value.data.status == 'OK') {
                            tokenService.setLocalToken(value.data.data);
                            $location.path('/home');
                        } else {
                             alertService.show('Aviso', 'El Token no es válido');
                        }
                    });
            };
        }]);