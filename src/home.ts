import * as ng from 'angular';
import { ItemReorderCustomEvent } from '@ionic/core';
import { arrayMove } from './utils';

ng.module('app')
    .controller('homeCtrl', ['$scope', '$location', 'alertService', 'tokenService', 'testService',
        function ($scope, $location: ng.ILocationService, alertService, tokenService, testService) {
            $scope.info = {
                title: 'Cuestionarios',
                tests: []
            };
            $scope.checkToken = () => {
                const token = tokenService.getLocalToken();

                if (!token) {
                    $location.path('/token');
                    return;
                }
                tokenService.sendToken(null, token)
                    .then((value: ng.IHttpResponse<any>) => {
                        if (value.status == 200 && value.data && value.data.status == 'OK') {
                            if (!token) tokenService.setLocalToken(value.data.data);
                            $scope.loadData();
                        } else {
                            $location.path('/token');
                        }
                    });
            };
            $scope.loadData = () => {
                testService.get()
                .then((value: ng.IHttpResponse<any>) => {
                    if (value.status == 200 && value.data && value.data.status == 'OK') {
                        $scope.info.tests = value.data.data;
                    } else {
                        alertService.show('Aviso', value.data.message);
                    }
                });
                const ionReorderGroup = document.querySelector('ion-reorder-group') as HTMLIonReorderGroupElement;
                ionReorderGroup.addEventListener('ionItemReorder', (ev: any) => {
                    const event = ev as ItemReorderCustomEvent;
                    event.detail.complete();
                    const from = $scope.info.tests[event.detail.from];
                    const to = $scope.info.tests[event.detail.to];
                    let newPrioridad = 
                        event.detail.to === 0 ? $scope.info.tests[0].prioridad - 100 :
                        event.detail.to === $scope.info.tests.length - 1 ? to.prioridad + 100 :
                            (to.prioridad + $scope.info.tests[event.detail.to-1].prioridad) / 2;
                    testService.modifyOrder({
                        token: tokenService.getLocalToken(),
                        id: from.id,
                        prioridad: newPrioridad
                    })
                    .then((value: ng.IHttpResponse<any>) => {
                        if (value.status == 200 && value.data && value.data.status == 'OK') {
                            from.prioridad = newPrioridad;
                            arrayMove($scope.info.tests, event.detail.from, event.detail.to);
                        } else {
                            alertService.show('Aviso', value.data.message);
                        }
                    });
                });
            };

            $scope.newTest = () => {
                $location.path('/test/new');
            };
            $scope.editTest = (id: string) => {
                $location.path(`/test/edit/${id}`);
            };
            $scope.startTests = () => {
                const id_cuestionarios: number[] = [];
                const checks = document.querySelectorAll('ion-checkbox[aria-checked="true"');
                if (checks.length == 0) {
                    alertService.show('Aviso', 'Debe seleccionar algún cuestionario');
                    return;
                }
                checks.forEach((value: Element) => {
                    const id = value.getAttribute('data-test-id');
                    if (id) id_cuestionarios.push(+id);
                });
                testService.startTests(id_cuestionarios)
                .then((value: ng.IHttpResponse<any>) => {
                    if (value.status == 200 && value.data && value.data.status == 'OK') {
                        $location.path('/quiz');
                    } else {
                        alertService.show('Aviso', value.data.message);
                    }
                });
            };
            $scope.searchTests = () => {
                $location.path('/explore');
            };

            $scope.checkToken();
        }]);