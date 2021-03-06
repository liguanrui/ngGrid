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

.controller('mcGridController', ['$http','$scope', '$attrs', function ($http, $scope, $attrs) {
	/**
	 * @label 触发选择
	 */
	$scope.isChosen={};
	$scope.chosenFn = function (key, item){
		if(  $scope.isChosen[key] ){
			$scope.isChosen = {};
		    if( angular.isDefined($scope.chosen)) {
				$scope.chosen = null ;
			}
		    $scope.isChosen[key] = false;
		}else{
			$scope.isChosen = {};
			if( angular.isDefined($scope.chosen)) {
				$scope.chosen = item ;
			}
			$scope.isChosen[key] = true;
		}
	}
	
	 /**
	 * @label 封装post方法
	 */
	 function angularPost(data, dataUrl, successFn){
		 if(!angular.isDefined(data)){
			 showTips("不允许提交的数据为空!");
			 return false;
		 }
		 if(!angular.isDefined(dataUrl)){
			 showTips("不存在可用的提交接口或方法!");
			 return false;
		 }
		 $http({
			    url: dataUrl,
			    method: "post",
			    data : $.param( data ),
	  		    headers : { 'Content-Type' : 'application/x-www-form-urlencoded'},
		 }).success(successFn);
	 }

	 /**
	  * @label 新增
	  */
	$scope.addItem={};
	$scope.add = function(){
		angularPost($scope.addItem, $scope.options.addBtn.postUrl, successFn);
	}
	
	/**
	 * @label 更新
	 */
	$scope.update = function(){
		angularPost($scope.chosen, $scope.options.updateBtn.postUrl, successFn);
	}
	
	/**
	 * @label 删除
	 */
	$scope.del = function(){
		angularPost($scope.chosen, $scope.options.deleteBtn.postUrl, successFn);
	}
	
	/**
	 * @label 成功统一返回的参数
	 */
	function successFn(json){
		console.log(json);
		showTips(json.msg);
		if(json.status==1){
			
		}
	}
	
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
				chosen: "=",
			},
			controller:'mcGridController',
			templateUrl: 'template/mcGrid.html',
			link: function (scope,element, attrs) {
				 
			}
		};
});


angular.module("template/mcGrid.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/mcGrid.html",
		"<table class='table table-bordered table-striped'>\n"+
		"		<thead>" +
		"			<tr>"+
		"				<th ng-repeat='item in options.columnDefs' ng-bind='item.name'></th>"+
		"			</tr>" +
		"		</thead>"+
		"		<tbody>"+
		"			<tr ng-repeat='(rowIndex,row) in source' ng-click='chosenFn(rowIndex,row)'  ng-class='{danger: isChosen[rowIndex]}'>"+
		"				<td ng-repeat='(colIndex,col) in options.columnDefs'>" +
		"						<span ng-if=\"col.type!='select'\" ng-bind='row[col.key]'></span>"+
		"						<span ng-if=\"col.type=='select'\" ng-bind='col.arr[row[col.key]]'></span>"+
		//"					<span ng-if='!col.cellTemplate' ng-bind='row[col.field]'></span>" +
		//"					<span ng-if='col.cellTemplate'  ng-bind-html='col.cellTemplate|showHtml'> </span>" +
		"				</td>"+
		"			</tr>"+
		"</table>\n"+
		"<!-- 新增模态框 -->"+
		"<div mc-model  ng-if='options.addBtn' modelid='{{options.addBtn.nodeId}}'  modelhead='{{options.addBtn.label}}'  modelsize='{{option.addBtn.size}}'>"+
	    "      <div class='modal-body'>"+
	    "             <div mc-edit  column='options.columnDefs'  param='addItem'></div>"+
      	"	   </div>"+
        "       <div class='modal-footer'>"+
        "          	<button type='button' class='btn btn-primary'  ng-click='add()'>保存</button>"+
        "       </div>"+
		"</div>"+
		"<!-- 更新模态框 -->"+
		"<div mc-model  ng-if='options.updateBtn' modelid='{{options.updateBtn.nodeId}}'  modelhead='{{options.updateBtn.label}}'  modelsize='{{option.updateBtn.size}}'>"+
		"      <div class='modal-body'>"+
		"             <div mc-edit  column='options.columnDefs'  param='chosen'></div>"+
		"	   </div>"+
		"       <div class='modal-footer'>"+
		"          	<button type='button' class='btn btn-primary'  ng-click='update()'>保存</button>"+
		"       </div>"+
		"</div>"+
		"<!-- 删除模态框 -->"+
		"<div mc-model  ng-if='options.deleteBtn' modelid='{{options.deleteBtn.nodeId}}'  modelhead='{{options.deleteBtn.label}}'  modelsize='{{option.deleteBtn.size}}'>"+
		"      <div class='modal-body'>"+
		"			  <h5 class='text-danger'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> 确定要删除该条数据？</h5>"+	
		"             <table class='table table-striped table-hover'>" +
		"				  <tr ng-repeat='(k,v) in options.columnDefs'>" +
		"					<td ng-bind='v.name'></td>" +
		"					<td ng-bind='chosen[v.key]'></td>"+
		"				  </tr>"+
		"			  </table>"+
		"	   </div>"+
		"       <div class='modal-footer'>"+
		"          	<button type='button' class='btn btn-primary'  ng-click='del()'>确定</button>"+
		"       </div>"+
		"</div>"+
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

.directive('mcdatepicker', function() {
    return {
        restrict: 'EA',
        require : 'ngModel',
        scope: {
        	format : "@",
        },
        link : function (scope, element, attrs, ngModelCtrl) {
        	if(!angular.isDefined(scope.format)){
        		scope.format="yyyy/mm/dd";
        	}
        	var dateOption={};
    		var isExist={};
    		isExist.year = scope.format.indexOf("yyyy")>=0 ? true : false;
    		isExist.month = scope.format.indexOf("mm")>=0 ? true : false;
    		isExist.day = scope.format.indexOf("dd")>=0 ? true : false;
    		isExist.hour = scope.format.indexOf("HH")>=0 ? true : false;
    		isExist.mintue = scope.format.indexOf("ii")>=0 ? true : false;
    		isExist.second = scope.format.indexOf("ss")>=0 ? true : false;
    		//console.log(isExist);
    		
    		//api地址：http://www.bootcss.com/p/bootstrap-datetimepicker/
    		dateOption.format=scope.format;
    		dateOption.autoclose=1;
    		dateOption.forceParse=0;
    		
    		if( isExist.year){
    			dateOption.weekStart=1;
    		}
    		if( isExist.day){
    			dateOption.todayBtn=1;
    			dateOption.todayHighlight=1;
    		}
    		if( !isExist.year && !isExist.month && !isExist.day){
    			dateOption.startView=1;//format: HH:ii:ss OR format: HH:ii ……
    			dateOption.maxView=1;
    			dateOption.minView=0;
    		}
    		if( !isExist.hour && !isExist.mintue && !isExist.second && isExist.year && isExist.month && isExist.day){
    			dateOption.startView=2;//format:yyyy/mm/dd
				dateOption.minView=2;
    		}
    		if( !isExist.hour && !isExist.mintue && !isExist.second && isExist.year && isExist.month && !isExist.day){
    			dateOption.startView=3;//format:yyyy/mm
    			dateOption.minView=3;
    		}
    		
    		//console.log(dateOption);
        	$(function(){
        		element.datetimepicker(dateOption);
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
