/***********************************************
* mc-grid JavaScript Library
* Authors: liguanrui
* mail : xhsysu@126.com
* Create At: 2014-10-21 
* update At:2015-03-13 Edit 1.2.1
***********************************************/



/************************************************
 * directive : compile
 * description : angular再编译
***********************************************/
angular.module('compile', [], function($compileProvider) {
    // configure new 'compile' directive by passing a directive
    // factory function. The factory function injects the '$compile'
    $compileProvider.directive('compile', function($compile) {
      // directive factory creates a link function
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
             // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);
            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
          }
        );
      };
    })
  });

angular.module('ui.mc.grid', ['ui.mcGrid','mc.modal','mc.edit',"mc.datetimepicker","mc.multiple","compile"]);


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
		    $scope.chosen = null ;
		    $scope.isChosen[key] = false;
		}else{
			$scope.isChosen = {};
			$scope.chosen = item ;
			$scope.isChosen[key] = true;
		}
	}
	
	/**
	 * @label 分页
	 */
	if(angular.isDefined($scope.options.pagination) && $scope.options.pagination!=false){
		var isShowPage = true;
	}else{
		var isShowPage = false;
		$scope.options.pagination={};
	}
	
	if(isShowPage){
		$scope.currentPage = 1;  //默认当前页
		$scope.maxSize = angular.isDefined($scope.options.pagination.maxSize)? $scope.options.pagination.maxSize: 5;     //默认分页显示数字按钮数目
		$scope.perPage = angular.isDefined($scope.options.pagination.perPage)? $scope.options.pagination.perPage : 15;  //默认分页数
	}
	$scope.pageChanged=function(){
		if(isShowPage){
			$scope.param['start']=($scope.currentPage-1)*$scope.perPage;
			$scope.param['limit']=$scope.perPage;
		}
		if(angular.isUndefined($scope.options.method) || $scope.options.method=='GET'){
			angularGet($scope.param, $scope.options.postUrl, pageChangedFn);
		}else{
			angularPost($scope.param, $scope.options.postUrl, pageChangedFn);
		}
	}
	function pageChangedFn(json){
		 if(json.status === 1) {
			  $scope.source = json;
			  $scope.sourceEmpty= $.isEmptyObject($scope.source.rows);
		  }else{
			  console.log("json.status状态值不正确或者获取数据失败!");
		  }
	}
	
	/**
	 * 把pageChange传递出去
	 */
	$scope.pagefn = function(){
		$scope.pageChanged();
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
	  * @label 封装GET方法
	  */
	 function angularGet(data, dataUrl, successFn){
		 if(!angular.isDefined(dataUrl)){
			 showTips("不存在可用的提交接口或方法!");
			 return false;
		 }
		 $http({
			url: dataUrl,
			method: "get",
			params: data
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
		delete $scope.chosen['$$hashKey'];
		angularPost($scope.chosen, $scope.options.updateBtn.postUrl, successFn);
	}
	
	/**
	 * @label 删除
	 */
	$scope.del = function(){
		delete $scope.chosen['$$hashKey'];
		angularPost($scope.chosen, $scope.options.deleteBtn.postUrl, successFn);
	}
	
	/**
	 * @label 成功统一返回的参数
	 */
	function successFn(json){
		//console.log(json);
		showTips(json.msg);
		if(json.status==1){
			$scope.pageChanged();
			$(".modal").modal("hide");
		}
	}
	
	/**
	 * 预处理 options.combine
	 */
	$scope.param={};
	if(angular.isDefined($scope.options.combine)){
		angular.forEach($scope.options.combine, function (item, index) {
			var placeholderStr="";
			var widthStr="";
			var classStr="";
			if(angular.isDefined(item.value)){
				$scope.param[item.key]=item.value;
			}else{
				$scope.param[item.key]="";
			}
			if(angular.isDefined(item.placeholder)){
				placeholderStr=" placeholder='"+item.placeholder+"' ";
			}
			if(angular.isDefined(item.width)){
				widthStr=" width='"+item.width+"' ";
			}
			if(angular.isDefined(item.class)){
				classStr=item.class;
			}
			if(angular.isUndefined(item.type) || item.type=='text'){
				$scope.options.combine[index]['template']="<input class='form-control "+classStr+"' "+placeholderStr+widthStr+" type='text'  ng-model='param[item.key]'>";
			}
			if(item.type=='select'){
				$scope.options.combine[index]['template']="<select class='form-control "+classStr+"' "+placeholderStr+widthStr+" ng-model='param[item.key]' ng-options='k as v for (k,v) in item.arr'>\n"+
				"<option  value=''> ---请选择--- </option>\n"+
				"</select>";
			}
			if(item.type=='datetime'){
				$scope.options.combine[index]['template']="<input class='form-control "+classStr+"' "+placeholderStr+widthStr+" type='text' ng-model='param[item.key]' mcdatepicker>\n";
			}
			if(item.type=='textarea'){
				$scope.options.combine[index]['template']="<textarea class='form-control "+classStr+"' "+placeholderStr+widthStr+" rows='3' ng-model='param[item.key]'></textarea>\n";
			}
		});
	}
	
	/**
	 * 按钮
	 */
	if(angular.isDefined($scope.options.addBtn)){
		$scope.options.addBtn.modalHead="新增";
		
	}
	if(angular.isDefined($scope.options.updateBtn)){
		$scope.options.updateBtn.modalHead="更新";
	}
	if(angular.isDefined($scope.options.deleteBtn)){
		$scope.options.deleteBtn.modalHead="删除";
	}
	
	/**
	 * 表格cellTemplate
	 */
	if(angular.isDefined($scope.options.columnDefs)){
		$scope.colspan=0;
		angular.forEach($scope.options.columnDefs, function (item, index) {
			$scope.colspan++;
			if( angular.isUndefined(item.cellTemplate) ){
				if( item.type!='select' && item.type!= 'seqnum'){
					var cellTemplate="<span ng-bind='row[col.key]'></span>";
				}
				if( item.type=='seqnum'){
					var cellTemplate="<span ng-bind='(currentPage-1)*perPage+rowIndex+1'></span>";
				}
				if( item.type=='select'){
					var cellTemplate="<span ng-bind='col.arr[row[col.key]]'></span>";
				}
				$scope.options.columnDefs[index]['cellTemplate']=cellTemplate;
			}
		});
	}
	
	/**
	* 判断数据渲染是否为空
	**/
	

	
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
				source: "=?",
				chosen: "=?",
				param: "=?",
				pagefn: "=?",
			},
			controller:'mcGridController',
			templateUrl: 'template/mcGrid.html',
			transclude : true,
			link: function (scope,element, attrs) {
				scope.pageChanged();
			}
		};
});


angular.module("template/mcGrid.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/mcGrid.html",
		"<nav class='navbar navbar-default' role='navigation'>\n"+
		"	<form class='navbar-form navbar-left' role='search' ng-if='options.combine'>\n"+
		"		<div class='input-group input-group-sm' ng-repeat='(index,item) in options.combine'>\n"+
		"				<span class='input-group-addon' ng-bind='item.name' ></span>\n"+
		"				<span compile='item.template'></span>\n"+
		"		</div>\n"+
		"	</form>\n"+
		"	<ul style='padding:13px;float:left' >" +
		"		<button ng-if='options.combine' class='btn btn-primary btn-sm' type='button' ng-click='pageChanged()'>搜索</button>"+
		"		<button ng-if='options.addBtn' data-target='#add-model' data-toggle='modal' class='btn btn-success btn-sm' type='button'>新增</button>"+
        "		<button ng-if='options.updateBtn' data-target='#update-model' data-toggle='modal' class='btn btn-info btn-sm' type='button' ng-disabled='chosen==null'>更新</button>"+
        "		<button ng-if='options.deleteBtn' data-target='#delete-model' data-toggle='modal' class='btn btn-danger btn-sm' type='button' ng-disabled='chosen==null'>删除</button>"+
		"		<span ng-transclude></span>"+
        "	</ul>" +
		"</nav>\n"+
		"<table class='table table-bordered table-striped' ng-if='options.columnDefs'>\n"+
		"		<thead>" +
		"			<tr>"+
		"				<th ng-repeat='item in options.columnDefs' ng-bind='item.name' width='{{item.width}}'></th>"+
		"			</tr>" +
		"		</thead>"+
		"		<tbody>"+
		"			<tr class='danger' ng-if='sourceEmpty'>"+
		"				<td colspan='{{colspan}}' class='text-center'><span>暂无数据</span></td>"+
		"			</tr>"+
		"			<tr ng-repeat='(rowIndex,row) in source.rows' ng-click='chosenFn(rowIndex,row)'  ng-class='{danger: isChosen[rowIndex]}'>"+
		"				<td ng-repeat='(colIndex,col) in options.columnDefs'>" +
		"					<span compile='col.cellTemplate'></span>" +
		"				</td>"+
		"			</tr>"+
		"</table>\n"+
		"<!-- 新增模态框 -->"+
		"<div mc-modal  ng-if='options.addBtn' modalid='add-model'  modalhead='{{options.addBtn.modalHead}}'  modalsize='{{option.addBtn.modalSize}}' modalfn='add'>"+
	    "      <div mc-edit  column='options.columnDefs'  param='addItem'></div>"+
		"</div>"+
		"<!-- 更新模态框 -->"+
		"<div mc-modal  ng-if='options.updateBtn' modalid='update-model'  modalhead='{{options.updateBtn.modalHead}}'  modalsize='{{option.updateBtn.modalSize}}' modalfn='update'>"+
		"      <div mc-edit  column='options.columnDefs'  param='chosen'></div>"+
		"</div>"+
		"<!-- 删除模态框 -->"+
		"<div mc-modal  ng-if='options.deleteBtn' modalid='delete-model'  modalhead='{{options.deleteBtn.modalHead}}'  modalsize='{{option.deleteBtn.modalSize}}' modalfn='del'>"+
		"		<h5 class='text-danger'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> 确定要删除该条数据？</h5>"+	
		"       <table class='table table-striped table-hover'>" +
		"			<tr ng-repeat='(k,v) in options.columnDefs' ng-if=\"v.type!='seqnum'\">" +
		"				<td ng-bind='v.name'></td>" +
		"				<td ng-if=\"v.type!='select'\" ng-bind='chosen[v.key]'></td>"+
		"				<td ng-if=\"v.type=='select'\" ng-bind='v.arr[chosen[v.key]]'></td>"+
		"			</tr>"+
		"		</table>"+
		"</div>"+
		"<!-- 分页 -->"+
		"<dic class='row' ng-show='options.pagination'>"+
		"	<pagination class='pull-right' style='margin:0px' total-items='source.total'  ng-model='currentPage'  ng-change='pageChanged()'  max-size='maxSize' boundary-links='true' rotate='false' num-pages='numPages' previous-text='&lsaquo;' next-text='&rsaquo;' first-text='&laquo;' last-text='&raquo;'  items-per-page='perPage'></pagination>"+
		"</span>"+
		"");
	}]);


/************************************************
 * directive : mcModal
 * description : model插件
 * Rely on : bootstrap-datetimepicker
***********************************************/
angular.module('mc.modal', ["template/mcModal.html"])

.controller('ModalController', ['$http','$scope', '$attrs', function ($http,$scope, $attrs) {
	
}])

.directive('mcModal', function() {
    return {
        restrict: 'EA',
		scope: {
			modalid: "@",
			modalsize: "@",
			modalhead: "@",
			modalfn: "=",
		},
		templateUrl: 'template/mcModal.html',
		controller:'ModalController',
		transclude : true,
		replace : true,
        link : function (scope, element, attrs, ngModelCtrl) {
 
        }
    }
})

angular.module("template/mcModal.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/mcModal.html",
		"<div class='modal fade'  id='{{modalid}}'  tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>"+
      	"	<div class='modal-dialog {{modalsize}}'>"+
      	"		<div class='modal-content'>"+
      	"			<div class='modal-header'>"+
      	"				<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>"+
      	"				<h4 class='modal-title' >{{modalhead}}</h4>"+
      	"			</div>"+
	    "      		<div class='modal-body'>"+
	    "             <div ng-transclude></div>"+
      	"	   		</div>"+
        "       	<div class='modal-footer'>"+
        "          		<button type='button' class='btn btn-primary'  id='{{modalid}}-btn' ng-click='modalfn()' data-loading-text='Loading...' autocomplete='off'>确定</button>"+
        "       	</div>"+
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
	/**
	 * 预处理 options.combine
	 */
	if(angular.isDefined($scope.column)){
		angular.forEach($scope.column, function (item, index) {
			var placeholderStr="";
			var widthStr="";
			var classStr="";
			
			if(angular.isUndefined(item.placeholder)){
				$scope.column[index]['placeholder'] = "";
			}
			if(angular.isUndefined(item.width)){
				$scope.column[index]['width'] = "";
			}
			if(angular.isUndefined(item.class)){
				$scope.column[index]['class'] = "input-sm";
			}
			if(angular.isUndefined(item.type)){
				$scope.column[index]['type'] = "text";
			}
			
		});
	}
	
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
			//console.log(scope.param);
		}
	}
})

angular.module("template/mcEdit.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("template/mcEdit.html",
	" <div class='form-group' ng-repeat='(colIndex,col) in column' ng-show=\"col.type!='id'&&col.type!='seqnum'\">"+
    " 		<label >{{col.name}}</label>"+
    "		<input class='form-control {{item.class}}' type='text' placeholder='{{col.placeholder}}' width='{{col.width}}' ng-if=\"col.type=='text'\"   ng-model='param[col.key]'>\n"+
	"		<select class='form-control {{item.class}}' width='{{col.width}}' ng-if=\"col.type=='select'\" ng-model='param[col.key]' ng-options='k as v for (k,v) in col.arr'>\n"+
	"			<option  value=''> ---请选择--- </option>\n"+
	"		</select>"+
	"		<input class='form-control {{item.class}}' placeholder='{{col.placeholder}}' type='text' width='{{col.width}}' ng-if=\"col.type=='datetime'\"  ng-model='param[col.key]' mcdatepicker format='{{col.format}}'>\n"+
	"		<input class='form-control {{item.class}}' placeholder='{{col.placeholder}}' type='text' width='{{col.width}}' ng-if=\"col.type=='span'\"  ng-model='param[col.key]' disabled>\n"+
	"		<textarea class='form-control {{item.class}}' placeholder='{{col.placeholder}}' width='{{col.width}}' ng-if=\"col.type=='textarea'\" rows='3' ng-model='param[col.key]'></textarea>\n"+
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
        	if( !angular.isDefined(scope.format) || scope.format==""){
        		scope.format="yyyy/mm/dd";
        	}
        	 
        	var dateOption={};
    		var isExist={};
    		isExist.year = scope.format.indexOf("yyyy")>=0 ? true : false;
    		isExist.month = scope.format.indexOf("mm")>=0 ? true : false;
    		isExist.day = scope.format.indexOf("dd")>=0 ? true : false;
    		isExist.hour = scope.format.indexOf("hh")>=0 ? true : false;
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
