import * as ng from 'angular';

ng.module('app')
    .controller('quizCtrl', ['$scope', '$location', '$timeout', 'alertService', 'tokenService', 'testService',
        function ($scope, $location: ng.ILocationService, _$timeout: ng.ITimeoutService, alertService, tokenService, testService) {
            $scope.info = {
                title: 'Práctica',
                currentItem: {
                    respuestaIndex: -1
                },
                editTestButtons: false
            };
            $scope.fetchQuiz = () => {
                testService.getQuiz()
                .then((value: ng.IHttpResponse<any>) => {
                    if (value.status == 200 && value.data && value.data.status == 'OK') {
                        $scope.info.currentItem = value.data.data;
                        $scope.info.respuestas = value.data.message;
                        $scope.info.currentItem.respuestaIndex = -1;
                        document.querySelector('ion-segment-button[name=\'btnSiguiente\']')?.setAttribute('disabled', 'true');
                    } else {
                        alertService.show('Aviso', value.data.message);
                        $location.path('/home');
                    }
                });
            };
            $scope.setRespuesta = (index: number) => {
                $scope.info.currentItem.respuestaIndex = index;
                document.querySelector('ion-segment-button[name=\'btnSiguiente\']')?.setAttribute('disabled', 'false');
            };
            $scope.next = () => {
                const data = {
                    token: tokenService.getLocalToken(),
                    id_pregunta: $scope.info.currentItem.id,
                    respuesta: $scope.info.currentItem.respuestaIndex === 999 ? '' : $scope.info.respuestas[$scope.info.currentItem.respuestaIndex]
                };
                const correcta = data.respuesta === $scope.info.currentItem.respuesta;
                if (!correcta) {
                    alertService.show(
                        $scope.info.currentItem.respuestaIndex === 999  ? 'Solución' : 'Respuesta incorrecta',
                        `Correcta: ${$scope.info.currentItem.respuesta})`,
                        () => { $scope.sendAnswer(data); });
                } else {
                    $scope.sendAnswer(data);
                }
            };
            $scope.sendAnswer = (data: any) => {
                testService.sendAnswer(data)
                .then((value: ng.IHttpResponse<any>) => {
                    if (value.status == 200 && value.data && value.data.status == 'OK') {
                        $scope.fetchQuiz();
                    } else {
                        alertService.show('Aviso', value.data.message);
                        $location.path('/home');
                    }
                });
            };
            $scope.goBack = () => {
                $location.path('/home');
            };
            $scope.edit = () => {
                //$scope.info.currentItem = item;
                //$scope.info.currentItem.respuestaIndex = $scope.info.respuestas.indexOf($scope.info.currentItem.respuesta);
                const textArea = document.getElementById('editTexto') as HTMLIonTextareaElement;
                textArea.value = $scope.info.currentItem.texto;
                textArea.autoGrow = true;
                textArea.rows = 12;
                const modal = document.getElementById('editModal') as HTMLIonModalElement;
                modal.setAttribute('is-open', 'true');
            };
            $scope.cancelEditQuestion = () => {
                const modal = document.getElementById('editModal') as HTMLIonModalElement;
                modal.setAttribute('is-open', 'false');
            };
            $scope.saveEditQuestion = () => {
                const textArea = document.querySelector('textarea[name=\'editTexto\']') as HTMLTextAreaElement;
                if (!textArea.value) {
                    alertService.show('Aviso', 'Debe indicar el texto de la pregunta');
                    return;
                }
                const data = {
                    token: tokenService.getLocalToken(),
                    id: $scope.info.currentItem.id,
                    texto: textArea.value,
                    respuesta: $scope.info.currentItem.respuesta
                };
                testService.modifyQuestion(data)
                    .then((value: ng.IHttpResponse<any>) => {
                        if (value.status == 200 && value.data && value.data.status == 'OK') {
                            $scope.info.currentItem.texto = data.texto;
                            const modal = document.getElementById('editModal') as HTMLIonModalElement;
                            modal.setAttribute('is-open', 'false');
                        } else {
                            alertService.show('Aviso', value.data.message);
                        }
                    }, (error: any) => {
                        alertService.show('Aviso', error.data.message);
                    });
            };
            $scope.fetchQuiz();
        }]);
