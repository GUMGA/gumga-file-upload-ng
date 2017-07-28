angular.module('app', ['gumga.fileupload', 'gumga.services.mimetype'])
  .config(function ($httpProvider) {
    $httpProvider.defaults.headers.common['gumgaToken'] = 'gumgaDocumentationEternal'
  })
  .controller('Ctrl', function($scope, $q, $timeout){

    $scope.entity = {};

     $scope.uploadStart = function() {
       console.log('START')
     }
     $scope.uploadComplete = function(e) {
       console.log('COMPLETE')
     }
     $scope.uploadAbort = function(e) {
       console.log('ABORT')
     }
     $scope.uploadError = function(e) {
       console.log('ERROR')
     }

  })
