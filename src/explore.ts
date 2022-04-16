import * as ng from 'angular';

ng.module('app')
    .controller('exploreCtrl', ['$scope', '$location', 'alertService', 'testService',
        function ($scope, $location: ng.ILocationService, alertService, testService) {
            $scope.info = {
                title: 'Cuestionarios públicos',
                tests: []
            };
            
            $scope.loadData = () => {
                testService.getPublic()
                .then((value: ng.IHttpResponse<any>) => {
                    if (value.status == 200 && value.data && value.data.status == 'OK') {
                        $scope.info.tests = value.data.data;
                    } else {
                        alertService.show('Aviso', value.data.message);
                    }
                });
            };

            $scope.home = () => {
                $location.path('/');
            };
            
            $scope.importTests = () => {
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
                testService.importTests(id_cuestionarios)
                .then((value: ng.IHttpResponse<any>) => {
                    if (value.status == 200 && value.data && value.data.status == 'OK') {
                        $location.path('/');
                    } else {
                        alertService.show('Aviso', value.data.message);
                    }
                });
            };

            $scope.loadData();

        }]);