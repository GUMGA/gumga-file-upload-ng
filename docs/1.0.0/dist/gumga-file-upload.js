/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
FileUpload.$inject = ['$parse', 'GumgaMimeTypeService', '$http', '$timeout'];

function FileUpload($parse, GumgaMimeTypeService, $http, $timeout) {

  var template = '\n      <div>\n      <section class="drag">\n           <span  class="glyphicon glyphicon-download-alt"></span>\n       </section>\n      <div style="margin-bottom: 10px">\n          <input type="file" id="input" ng-hide="true" ng-model="file">\n          <button type="button" ng-click="click()" class="btn btn-default">\n              <span class="glyphicon glyphicon-search"></span> Selecionar\n          </button>\n          <button type="button" ng-disabled="queue.length == 0"ng-click="upload()" class="btn btn-default">\n              <span class="glyphicon glyphicon-cloud-upload"></span> Enviar\n          </button>\n          <button type="button" ng-click="clear()" class="btn btn-default pull-right" ng-disabled="queue.length == 0">\n              <span class="glyphicon glyphicon-trash"></span> Limpar\n          </button>\n      </div>\n      <p class="alert alert-info" ng-show="queue.length == 0 && !alert">\n          <span class="glyphicon glyphicon-info-sign"></span> Selecione um arquivo ou arraste e solte aqui\n      </p>\n      <p class="alert alert-danger" ng-show="queue.length == 0 && alert">\n          <span class="glyphicon glyphicon-alert"></span> {{alert}}\n      </p>\n      <ul class="list-group" ng-show="queue.length > 0">\n          <li class="list-group-item alert" style="background-color: #d7eac8" ng-repeat="file in queue">\n              <div class="media">\n                  <div class="media-left">\n                      <span class="media-object glyphicon glyphicon-file" style="font-size: 32px"></span>\n                  </div>\n                  <div class="media-body">\n                      <h4 class="media-heading">{{file.name}}</h4>\n                      <span>{{file.size}} KB</span>\n                      <span></span>\n                      <div class="progress">\n                          <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="{{file.percent}}" aria-valuemin="0" aria-valuemax="100" style="width: {{file.percent}}%">\n                              <span>{{file.percent || 0}}%</span>\n                          </div>\n                      </div>\n                  </div>\n              </div>\n          </li>\n      </ul>\n      </div>\n      ';

  link.$inject = ['$scope', '$element', '$attrs'];

  function link($scope, $element, $attrs) {
    var ERR_MSGS = {
      noEndPoint: 'É necessário um atributo endpoint no componente, contendo uma URL de API REST que receberá os arquivos.'
    };

    if (!$attrs.endpoint) console.error(ERR_MSGS.noEndPoint);

    var element = $element.find('input'),
        model = $parse($attrs.model),
        modelSetter = model.assign,
        endpoint = $attrs.endpoint,
        accepted = $attrs.accepted ? $attrs.accepted.split(',') : false,
        maxSize = $attrs.maxSize ? parseInt($attrs.maxSize) : false,
        stopEvent = function stopEvent(event) {
      event.stopPropagation();
      event.preventDefault();
    };

    function _validateAcceptedTypes(file) {
      return accepted ? GumgaMimeTypeService.validate(file.type, accepted) : true;
    }
    function _validateMaxSize(file) {
      return maxSize ? file.size <= maxSize * 1024 : true;
    }

    var validateAcceptedTypes = _validateAcceptedTypes,
        validateMaxSize = _validateMaxSize;

    var addFileToQueue = function addFileToQueue(file) {
      $scope.queue.push({
        type: file.type,
        name: file.name,
        size: Math.round(file.size / 1024),
        file: file
      });
    };

    $scope.queue = [];

    $element.on('dragenter', function (event) {
      stopEvent(event);
      $element.find('section')[0].classList.add('dragOver');
    });
    $element.on('dragover', function (event) {
      stopEvent(event);
      $element.find('section')[0].classList.add('dragOver');
    });

    $element[0].ondrop = function (event) {
      console.log('oi', event);
      stopEvent(event);
      $scope.$apply(function () {
        return angular.forEach(event.dataTransfer.files, function (file) {
          return addFileToQueue(file);
        });
      });
      $element.find('section')[0].classList.remove('dragOver');
    };

    // $element.on('drop', (event) => {
    //   stopEvent(event)
    //   $scope.$apply(() => angular.forEach(event.dataTransfer.files, (file) => addFileToQueue(file)))
    //   $element.find('section')[0].classList.remove('dragOver')
    // })

    element.bind('change', function () {
      $scope.queue = [];
      angular.forEach(element[0].files, function (file, i) {
        var reader = new FileReader();
        reader.onload = function () {
          $scope.$apply(function () {
            modelSetter($scope, file);
            if (validateAcceptedTypes(file) && validateMaxSize(file)) {
              addFileToQueue(file);
            } else {
              var alert = ['Erro: '];
              if (validateAcceptedTypes(file)) alert.push('Formatos permitidos ' + accepted.join(', ') + '. ');
              if (validateMaxSize(file)) alert.push('M\xE1ximo de ' + maxSize + 'KB. ');
              alert.push('Selecione outro.');
              $scope.alert = alert.join('');
            }
          });
        };
        reader.readAsDataURL(file);
      });
    });

    var eventHandlers = {
      onLoadStart: $attrs.onUploadStart ? $scope.onUploadStart : angular.noop,
      onProgress: function onProgress(e, i) {
        return $timeout(function () {
          return $scope.queue[i].percent = Math.round(e.loaded / e.total * 100);
        });
      },
      onLoadEnd: $attrs.onUploadComplete ? $scope.onUploadComplete : angular.noop,
      onAbort: $attrs.onUploadAbort ? $scope.onUploadAbort : angular.noop,
      onError: $attrs.onUploadError ? $scope.onUploadError : angular.noop
    };

    $scope.upload = function () {
      eventHandlers.onLoadStart();
      angular.forEach($scope.queue, function (curr, i) {
        var formDataFile = new FormData();
        formDataFile.append($attrs.attribute, curr.file);
        $http({
          method: 'POST',
          url: endpoint,
          uploadEventHandlers: {
            progress: function progress(e) {
              return eventHandlers.onProgress(e, i);
            },
            loadend: function loadend(e) {
              return eventHandlers.onLoadEnd(e, i);
            },
            abort: function abort(e) {
              return eventHandlers.onAbort(e, i);
            },
            error: function error(e) {
              return eventHandlers.onError(e, i);
            }
          },
          headers: {
            'Content-Type': undefined
            // __XHR__: () => {
            //   return (xhr) => {
            //     xhr.upload.onprogress = (e) => eventHandlers.onProgress(e, i)
            //     xhr.upload.onloadend = (e) => eventHandlers.onLoadEnd(e, i)
            //     xhr.upload.onabort = (e) => eventHandlers.onAbort(e, i)
            //     xhr.upload.onerror = (e) => eventHandlers.onError(e, i)
            //   };
            // }
          },
          data: formDataFile
        }).then(function (response) {
          $scope.model = $scope.model || {};
          $scope.model.name = response.data;
        });
      });
    };
    $scope.click = function () {
      element[0].click();
    };
    $scope.clear = function () {
      $scope.queue = [];
      $scope.alert = null;
    };
  }

  return {
    restrict: 'E',
    template: template,
    scope: {
      model: '=',
      uploadMethod: '&',
      deleteMethod: '&',
      onUploadStart: '&?',
      onUploadComplete: '&?',
      onUploadAbort: '&?',
      onUploadError: '&?'
    },
    link: link
  };
}

var _module = angular.module('gumga.fileupload', []).directive('gumgaFileUpload', FileUpload);

exports.default = _module.name;

/***/ })
/******/ ]);