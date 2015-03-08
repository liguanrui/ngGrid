var app = angular.module('myApp', ['ui.mc.grid', 'ui.bootstrap']);
app.controller('MyCtrl1',function($scope) {
    $scope.dataSource = [{name: "Moroni",age: 50},
                         {name: "Tiancum",age: 43},
                         {name: "Jacob",age: 27},
                         {name: "Nephi",age: 29},
                         {name: "Enos",age: 34}];
    $scope.gridOptions ={columnDefs:[{key: "name",name: "姓名",type: "text"},
                                     {key: "age",name: "年龄",type: "text"}]
                        };
});


//-------------------------------
app.controller('MyCtrl2',function($scope) {
    $scope.dataSource = [{name: "Moroni",age: 50},
                         {name: "Tiancum",age: 43},
                         {name: "Jacob",age: 27},
                         {name: "Nephi",age: 29},
                         {name: "Enos",age: 34}];
    $scope.gridOptions ={columnDefs:[{key: "name",name: "姓名",type: "text"},
                                     {key: "age",name: "年龄",type: "text"}]
                        };
});