/***********************************************
* mc-grid JavaScript Library
* Authors: liguanrui
* mail : ligr190@mingchao.com
* Create At: 2014-10-21 
***********************************************/

angular.module('ui.mc.grid', ['ui.mcInput','ui.mcGrid','mc.model','mc.edit']);

/************************************************
 * directive : mc-input
 * description : 表头 高级搜索组合框
***********************************************/
angular.module('ui.mcInput', ["template/mcInput.html","mc.datetimepicker","mc.multiple"])

.controller('InputController', ['$http','$scope', '$attrs', function ($http,$scope, $attrs) {
	$scope.getData =function(){
		$scope.param=$scope.search;
		angular.forEach($scope.search, function (item, index) {
			if(angular.isArray(item)) 
				$scope.search[index]=stringify(item);
		});
		$http({
		      url: $scope.link,
		      method: "get",
		      params: $scope.search
		    }).success(function(json){
		      if(json.status === 1) {
		    	  $scope.source = json;
		      }else{
		    	  console.log("json.status状态值不正确或者获取数据失败!");
		      }
		    });
	}
}])

.directive("mcInput", function() {
		return {
			restrict: "EA",
			scope: {
				options: "=",
				link: "=",
				source: "=",
				param:"=",
			},
			controller:'InputController',
			templateUrl: 'template/mcInput.html',
			transclude : true,
			link: function (scope) {
				scope.search={};
				var sign=false;
				if(angular.isDefined(scope.options))
				angular.forEach(scope.options, function (item, index) {
					if(item.value!=undefined){
						scope.search[item.key]=item.value;
						sign=true;
					}else{
						scope.search[item.key]="";
					}
				});
				if(sign){
					scope.getData();
				}
				scope.inputChange=function(){
					scope.getData();
				};
			}
		};
});

angular.module("template/mcInput.html", []).run(["$templateCache", function($templateCache) {
		$templateCache.put("template/mcInput.html",
		"<nav class='navbar navbar-default' role='navigation'>\n"+
        "<div>\n"+
        "	<form class='navbar-form navbar-left' role='search'>\n"+
		"		<div class='input-group input-group-sm' ng-repeat='(index,item) in options'>\n"+
		"				<span class='input-group-addon' ng-bind='item.name' ></span>\n"+
		"				<input class='form-control' type='text'  ng-if=\"item.type=='text'\"  ng-change='inputChange()' ng-model='search[item.key]'>\n"+
		"				<select class='form-control'   ng-if=\"item.type=='select'\"  ng-change='inputChange()' ng-model='search[item.key]'>\n"+
		"					<option  value=''> ---请选择--- </option>\n"+
		"					<option  ng-repeat='(k,v) in item.arr' value='{{k}}'  ng-bind='v'> </option>\n"+
		"				</select>"+
		"				<input class='form-control'  type='text'  ng-if=\"item.type=='datetime'\"   ng-change='inputChange()' ng-model='search[item.key]' mcdatepicker>\n"+
		"				<select class='form-control multiselect' ng-if=\"item.type=='multiselect'\" ng-change='inputChange()' ng-model='search[item.key]' multiple='multiple' mcmultiple >\n"+
		"					<option  ng-repeat='(k,v) in item.arr' value='{{k}}'  ng-bind='v'> </option>\n"+
	    "				</select>\n"+
		"		</div>\n"+
		"	</form>\n"+
		"			<ul style='padding: 13px;' ng-transclude></ul>"+
		"</div>\n"+
		"</nav>\n"+
		"");
}]);



/************************************************
 * directive : mc-grid
 * description : 表格渲染
***********************************************/
angular.module('ui.mcGrid', ["template/mcGrid.html"])

.controller('mcGridController', ['$scope', '$attrs', function ($scope, $attrs) {
	
}])

.filter("showHtml",function($sce){
	return function( str ) {
			return $sce.trustAsHtml(str);
		}
})

.directive("mcGrid", function() {
		return {
			restrict: "EA",
			scope: {
				options: "=",
				source: "=",
			},
			controller:'mcGridController',
			templateUrl: 'template/mcGrid.html',
			link: function (scope,element, attrs) {
				/*angular.forEach(scope.options.columnDefs, function (item, index) {
					if(!item.cellTemplate){
						scope.options.columnDefs[index]['cellTemplate']="<span ng-bind='row[col.field]'></span>";
					}
				});*/
				//console.log(scope.options.columnDefs);
			}
		};
});


angular.module("template/mcGrid.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/mcGrid.html",
		"<table class='table table-bordered table-striped'>\n"+
		"		<thead>" +
		"			<tr>"+
		"				<th ng-repeat='item in options.columnDefs' ng-bind='item.displayName'></th>"+
		"			</tr>" +
		"		</thead>"+
		"		<tbody>"+
		"			<tr ng-repeat='(rowIndex,row) in source'>"+
		"				<td ng-repeat='(colIndex,col) in options.columnDefs'>" +
		"						<span ng-if='!col.selectOption' ng-bind='row[col.field]'></span>"+
		"						<span ng-if='col.selectOption' ng-bind='col.selectOption[row[col.field]]'></span>"+
		//"					<span ng-if='!col.cellTemplate' ng-bind='row[col.field]'></span>" +
		//"					<span ng-if='col.cellTemplate'  ng-bind-html='col.cellTemplate|showHtml'> </span>" +
		"				</td>"+
		"			</tr>"+
		"</table>\n"+
		"");
	}]);


/************************************************
 * directive : mcmodel
 * description : model插件
 * Rely on : bootstrap-datetimepicker
***********************************************/
angular.module('mc.model', ["template/mcModel.html"])

.directive('mcModel', function() {
    return {
        restrict: 'EA',
		scope: {
			modelid: "@",
			modelsize: "@",
			modelhead: "@",
			modelfn: "&",
		},
		templateUrl: 'template/mcModel.html',
		transclude : true,
		replace : true,
        link : function (scope, element, attrs, ngModelCtrl) {
 
        }
    }
})

angular.module("template/mcModel.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/mcModel.html",
		"<div class='modal fade'  id='{{modelid}}'  tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>"+
      	"	<div class='modal-dialog {{modelsize}}'>"+
      	"		<div class='modal-content'>"+
      	"			<div class='modal-header'>"+
      	"				<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>"+
      	"				<h4 class='modal-title' >{{modelhead}}</h4>"+
      	"			</div>"+
      	"			<div ng-transclude></div>"+
        "       </div>"+
        "    </div>"+
        " </div>"+
		"");
	}]);


/************************************************
 * directive : mcedit
 * description : edit插件
 * Rely on : bootstrap-datetimepicker
 ***********************************************/
angular.module('mc.edit', ["template/mcEdit.html","mc.datetimepicker","mc.multiple"])

.controller('EditController', ['$http','$scope', '$attrs', function ($http,$scope, $attrs) {
 
}])

.directive('mcEdit', function(){
	return {
		restrict: 'EA',
		scope: {
			column: "=",
			param: "=",
		},
		controller:'EditController',
		templateUrl: 'template/mcEdit.html',
		link : function (scope, element, attrs, ngModelCtrl) {
			console.log(scope.param);
		}
	}
})

angular.module("template/mcEdit.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("template/mcEdit.html",
	" <div class='form-group' ng-repeat='(colIndex,col) in column' ng-show=\"col.type!='id'\">"+
    " 		<label >{{col.name}}</label>"+
    "		<input class='form-control' type='text'  ng-if=\"col.type=='text'\"   ng-model='param[col.key]'>\n"+
	"		<select class='form-control'   ng-if=\"col.type=='select'\"    ng-model='param[col.key]'>\n"+
	"			<option  value=''> ---请选择--- </option>\n"+
	"			<option  ng-repeat='(k,v) in col.arr' value='{{k}}'  ng-bind='v'> </option>\n"+
	"		</select>"+
	"		<input class='form-control'  type='text'  ng-if=\"col.type=='datetime'\"  ng-model='param[col.key]' mcdatepicker>\n"+
	"		<input class='form-control'  type='text'  ng-if=\"col.type=='id'\"  ng-model='param[col.key]'>\n"+
	"</div>"+
	"");
}]);


/************************************************
 * directive : mcdatetimepicker、mcdatepicker、mctimepicker
 * description : 时间插件
 * Rely on : bootstrap-datetimepicker
 ***********************************************/
angular.module('mc.datetimepicker', [])

.directive('mcdatetimepicker', function() {
	return {
		restrict: 'EA',
		require : 'ngModel',
		link : function (scope, element, attrs, ngModelCtrl) {
			$(function(){
				element.datetimepicker({ 
					format: "yyyy/mm/dd hh:ii:ss",
					language:  "zh-CN",
					weekStart: 1,
					todayBtn:  1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					forceParse: 0
				});
			});
		}
	}
})

.directive('mcdatepicker', function() {
    return {
        restrict: 'EA',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
                element.datetimepicker({ 
                    format: "yyyy/mm/dd",
                    language:  "zh-CN",
                    weekStart: 1,
                    todayBtn:  1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2,
                    forceParse: 0
                });
            });
        }
    }
})


.directive('mctimepicker', function() {
    return {
        restrict: 'EA',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
                element.datetimepicker({ 
                    format: "hh:ii:ss",
                    language:  "zh-CN",
                    autoclose: 1,
                    startView: 1,
                    minView: 0,
                    maxView: 1,
                    forceParse: 0
                });
            });
        }
    }
});


/************************************************
 * directive : mcmultiple
 * description : 复选框插件
 * Rely on : bootstrap-multiselect
***********************************************/
angular.module('mc.multiple', [])

.directive('mcmultiple', function() {
    return {
        restrict: 'EA',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
            	element.multiselect({
            		includeSelectAllOption: true,
            		maxHeight: 300
            	});	
            });
        }
    }
});
