import * as ng from 'angular';
import { alertController } from '@ionic/core';

ng.module('app')
    .service('alertService', [function() {
        return ({
            show: (title: string, message: string, callback?: Function) => {
                alertController.create({
                    header: title,
                    message: message.replaceAll('\r\n', '<br />'),
                    buttons: ['OK']
                }).then((alert: HTMLIonAlertElement) => {
                    alert.present();
                    if (callback) alert.onDidDismiss().then(() => { callback(); });
                });
            },
            confirm: (title: string, message: string, callback: Function) => {
                alertController.create({
                    header: title,
                    message: message.replaceAll('\r\n', '<br />'),
                    buttons: ['Cancel', 'OK']
                }).then((alert: HTMLIonAlertElement) => {
                    alert.present();
                    alert.onDidDismiss().then((value) => { callback(value); });
                });
            }
        });
    }])
    .service('tokenService', ['$http', function ($http: ng.IHttpService) {
        return ({
            getLocalToken: () => {
                return localStorage['TOKEN'];
            },
            setLocalToken: (token: string) => {
                localStorage['TOKEN'] = token;
            },
            sendToken: (captcha: string, token: string) => {
                return $http.post<any>('api/public/token', { captcha: captcha, token: token });
            }
        });
    }])
    .service('testService', ['$http', 'tokenService', function ($http: ng.IHttpService, tokenService: any) {
        return ({
            get: () => {
                return $http.get(`api/public/cuestionarios/${tokenService.getLocalToken()}`);
            },
            getOne: (id: string) => {
                return $http.get(`api/public/cuestionarios/${tokenService.getLocalToken()}/${id}`);
            },
            getPublic: () => {
                return $http.get('api/public/cuestionarios/publicos');
            },
            create: (data: any) => {
                return $http.post<any>('api/public/cuestionario', data);
            },
            modify: (data: any) => {
                return $http.patch<any>('api/public/cuestionario', data)
            },
            modifyOrder: (data: any) => {
                return $http.patch<any>('api/public/cuestionario/reordenar', data)
            },
            delete: (id: string) => {
                return $http.delete(`api/public/cuestionario/${tokenService.getLocalToken()}/${id}`)
            },
            getQuestions: (idCuestionario: string) => {
                return $http.get(`api/public/preguntas/${tokenService.getLocalToken()}/${idCuestionario}`);
            },
            createQuestion: (data: any) => {
                return $http.post<any>('api/public/pregunta', data);
            },
            modifyQuestion: (data: any) => {
                return $http.patch<any>('api/public/pregunta', data)
            },
            deleteQuestion: (id: string) => {
                return $http.delete(`api/public/pregunta/${tokenService.getLocalToken()}/${id}`)
            },
            startTests: (id_cuestionarios: number[]) => {
                return $http.post<any>('api/public/tests/start', {token:tokenService.getLocalToken(),id_cuestionarios:id_cuestionarios});
            },
            getQuiz: () => {
                return $http.get(`api/public/quiz/${tokenService.getLocalToken()}`);
            },
            sendAnswer: (data: any) => {
                return $http.post<any>('api/public/quiz', data)
            },
            importTests: (id_cuestionarios: number[]) => {
                return $http.post<any>('api/public/tests/import', {token:tokenService.getLocalToken(),id_cuestionarios:id_cuestionarios});
            },
        });
    }])
    .service('clipboard', ['alertService', function (alertService: any) {
        return ({
            copy: (value: string) => {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(value);
                } else {
                    const el = document.createElement('textarea');
                    el.value = value;
                    el.setAttribute('readonly', '');
                    el.style.position = 'absolute';
                    el.style.left = '-9999px';
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                }
                alertService.show('Información', 'La información se ha copiado al portapapeles');
            }
        })
    }]);