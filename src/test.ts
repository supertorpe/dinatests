import * as ng from 'angular';

ng.module('app')
    .controller('testNewCtrl', ['$scope', '$location', '$timeout', 'alertService', 'tokenService', 'testService',
        function ($scope, $location: ng.ILocationService, $timeout: ng.ITimeoutService, alertService, tokenService, testService) {
            $scope.info = {
                title: 'Nuevo Cuestionario',
                isNew: true,
                nombre: null,
                respuestas: null
            };

            $timeout(() => {
                const inputNombre = document.querySelector('ion-input > input[name=\'nombre\']') as HTMLInputElement;
                inputNombre.addEventListener('input', (_ev: Event) => {
                    const ie = _ev as InputEvent;
                    const inputText = (ie.target as HTMLInputElement);
                    $scope.info.nombre = inputText.value;
                    $scope.$apply();
                });
            }, 100);

            $scope.save = () => {
                const selectRespuestas = document.querySelector('input[name="selectRespuestas"]') as HTMLInputElement;
                $scope.info.respuestas = selectRespuestas.value;
                if (!$scope.info.nombre || !$scope.info.respuestas) {
                    alertService.show('Aviso', 'Debe indicar el nombre y las posibles respuestas');
                    return;
                }
                testService.create({
                    token: tokenService.getLocalToken(),
                    nombre: $scope.info.nombre,
                    respuestas: $scope.info.respuestas,
                    publico: false,
                    multiple: false
                })
                    .then((value: ng.IHttpResponse<any>) => {
                        if (value.status == 200 && value.data && value.data.status == 'OK') {
                            $location.path(`test/edit/${value.data.data.id}`);
                        } else {
                            alertService.show('Aviso', value.data.message);
                        }
                    });
            };
            $scope.cancel = () => {
                $location.path('/');
            };
        }])
    .controller('testEditCtrl', ['$scope', '$location', '$routeParams', '$timeout', 'alertService', 'tokenService', 'testService',
        function ($scope, $location: ng.ILocationService, $routeParams: ng.route.IRouteParamsService, $timeout: ng.ITimeoutService, alertService, tokenService, testService) {
            $scope.info = {
                title: 'Editar Cuestionario',
                isNew: false,
                nombre: null,
                respuestas: null,
                texto: null,
                respuesta: null,
                respuestaIndex: -1,
                publico: false,
                editTestButtons: true
            };

            $timeout(() => {
                const inputNombre = document.querySelector('ion-input > input[name=\'nombre\']') as HTMLInputElement;
                inputNombre.addEventListener('input', (_ev: Event) => {
                    const ie = _ev as InputEvent;
                    const inputText = (ie.target as HTMLInputElement);
                    $scope.info.nombre = inputText.value;
                    $scope.$apply();
                });
                const inputTexto = document.querySelector('ion-textarea > div > textarea[name=\'texto\']') as HTMLInputElement;
                inputTexto.addEventListener('input', (_ev: Event) => {
                    const ie = _ev as InputEvent;
                    const inputText = (ie.target as HTMLInputElement);
                    $scope.info.texto = inputText.value;
                    $scope.$apply();
                });
            }, 100);

            testService.getOne($routeParams['id'])
                .then((value: ng.IHttpResponse<any>) => {
                    if (value.status == 200 && value.data && value.data.status == 'OK') {
                        $scope.info.nombre = value.data.data.nombre;
                        (document.querySelector('ion-input[name=\'nombre\']') as HTMLInputElement).value = $scope.info.nombre;
                        $scope.info.respuestas = value.data.data.respuestas;
                        (document.getElementById('checkPublico') as HTMLIonToggleElement).checked = value.data.data.publico;
                    } else {
                        alertService.show('Aviso', value.data.message);
                    }
                });

            testService.getQuestions($routeParams['id'])
                .then((value: ng.IHttpResponse<any>) => {
                    if (value.status == 200 && value.data && value.data.status == 'OK') {
                        $scope.info.preguntas = value.data.data;
                    } else {
                        alertService.show('Aviso', value.data.message);
                    }
                });

            $scope.setRespuesta = (index: number) => {
                $scope.info.respuestaIndex = index;
            };

            $scope.saveNewQuestion = () => {
                if ($scope.info.respuestaIndex >= 0) {
                    const selectRespuestas = document.querySelector('input[name="selectRespuestas"]') as HTMLInputElement;
                    $scope.info.respuesta = selectRespuestas.value[$scope.info.respuestaIndex];
                } else {
                    $scope.info.respuesta = null;
                }
                if (!$scope.info.texto || !$scope.info.respuesta) {
                    alertService.show('Aviso', 'Debe indicar el texto y la opción correcta');
                    return;
                }

                testService.createQuestion({
                    token: tokenService.getLocalToken(),
                    id_cuestionario: $routeParams['id'],
                    texto: $scope.info.texto,
                    respuesta: $scope.info.respuesta
                })
                    .then((value: ng.IHttpResponse<any>) => {
                        if (value.status == 200 && value.data && value.data.status == 'OK') {
                            $scope.info.preguntas.push(value.data.data);
                            $scope.info.texto = null;
                            $scope.info.respuesta = null;
                            $scope.info.respuestaIndex = -1;
                            const inputTexto = document.querySelector('ion-textarea > div > textarea[name=\'texto\']') as HTMLInputElement;
                            inputTexto.value = '';

                        } else {
                            alertService.show('Aviso', value.data.message);
                        }
                    });
            };

            $scope.removeQuestion = (id: string) => {
                alertService.confirm('Atención', 'Por favor, confirma la eliminación de la pregunta',
                    (value: any) => {
                        if (value.role == 'cancel') return;
                        testService.deleteQuestion(id)
                            .then((value: ng.IHttpResponse<any>) => {
                                if (value.status == 200 && value.data && value.data.status == 'OK') {
                                    $scope.info.preguntas.splice($scope.info.preguntas.findIndex((item: { id: string; }) => item.id == id), 1);
                                } else {
                                    alertService.show('Aviso', value.data.message);
                                }
                            });
                    });
            }

            $scope.save = () => {
                const selectRespuestas = document.querySelector('input[name="selectRespuestas"]') as HTMLInputElement;
                $scope.info.respuestas = selectRespuestas.value;
                if (!$scope.info.nombre || !$scope.info.respuestas) {
                    alertService.show('Aviso', 'Debe indicar el nombre y las posibles respuestas');
                    return;
                }
                testService.modify({
                    token: tokenService.getLocalToken(),
                    id: $routeParams['id'],
                    nombre: $scope.info.nombre,
                    respuestas: $scope.info.respuestas,
                    publico: (document.getElementById('checkPublico') as HTMLIonToggleElement).checked,
                    multiple: false
                })
                    .then((value: ng.IHttpResponse<any>) => {
                        if (value.status == 200 && value.data && value.data.status == 'OK') {
                            $location.path('/');
                        } else {
                            alertService.show('Aviso', value.data.message);
                        }
                    });
            };
            $scope.cancel = () => {
                $location.path('/');
            };
            $scope.remove = () => {
                alertService.confirm('Atención', 'Por favor, confirma la eliminación del cuestionario',
                    (value: any) => {
                        if (value.role == 'cancel') return;
                        testService.delete($routeParams['id'])
                            .then((value: ng.IHttpResponse<any>) => {
                                if (value.status == 200 && value.data && value.data.status == 'OK') {
                                    $location.path('/');
                                } else {
                                    alertService.show('Aviso', value.data.message);
                                }
                            }, (error: any) => {
                                alertService.show('Aviso', error.data.message);
                            });
                    });
            };

            $scope.editRespuesta = (index: number) => {
                $scope.info.currentItem.respuestaIndex = index;
            };
            $scope.edit = (item: any) => {
                $scope.info.currentItem = item;
                $scope.info.currentItem.respuestaIndex = $scope.info.respuestas.indexOf($scope.info.currentItem.respuesta);
                const textArea = document.getElementById('editTexto') as HTMLIonTextareaElement;
                textArea.value = item.texto;
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
                    respuesta: $scope.info.respuestas[$scope.info.currentItem.respuestaIndex]
                };
                testService.modifyQuestion(data)
                    .then((value: ng.IHttpResponse<any>) => {
                        if (value.status == 200 && value.data && value.data.status == 'OK') {
                            const pregunta = $scope.info.preguntas.find((p: any) => p.id == data.id);
                            if (pregunta) {
                                pregunta.texto = data.texto;
                                pregunta.respuesta = data.respuesta;
                            }
                            const modal = document.getElementById('editModal') as HTMLIonModalElement;
                            modal.setAttribute('is-open', 'false');
                        } else {
                            alertService.show('Aviso', value.data.message);
                        }
                    }, (error: any) => {
                        alertService.show('Aviso', error.data.message);
                    });
            };

        }]);