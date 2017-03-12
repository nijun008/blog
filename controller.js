/*博客控制器*/

var mainApp = angular.module("mainApp",[]);


mainApp.controller("updata",function ($scope,$http,$sce) {
  $http({
      url:'http://127.0.0.1:3000/home',
      method:'get',
    }).success(function (data,header,config,status) {
      $scope.arts = data;
    })
  $scope.uphome = function () {
    $http({
      url:'http://127.0.0.1:3000/home',
      method:'get',
    }).success(function (data,header,config,status) {
      $scope.arts = data;
    });
  }
  $scope.uphtml = function () {
    $http({
      url:'http://www.nijun.top:3000/html/css',
      method:'get',
    }).success(function (data,header,config,status) {
      $scope.htmlarts = data;
    })
  }
  $scope.upjs = function () {
    $http({
      url:'http://www.nijun.top:3000/javascript',
      method:'get',
    }).success(function (data,header,config,status) {
      $scope.jsarts = data;
    })
  }
  $scope.upother = function () {
    $http({
      url:'http://www.nijun.top:3000/other',
      method:'get',
    }).success(function (data,header,config,status) {
      $scope.otherarts = data;
    })
  }
});

//不转义HTML过滤器
mainApp.filter('trustHtml',function ($sce) {
  return function (input) {
    return $sce.trustAsHtml(input);
  }
});
