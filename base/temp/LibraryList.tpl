<{extends file='module/common/base.tpl'}>
<{block name=ExtendCss}>
<{/block}>
<{block name=ExtendBody}>
<div ng-app="GridModule">
	<div  ng-controller="GridCtrl">
		<!-- 表头 高级搜索组合框 -->
		<div mc-input options="combine"  link="dataUrl"  source="dataSource"  param="SeachParam">
		    <button data-target="#add-model"  data-toggle="modal"  class="btn btn-success btn-sm"  type="button"  >新增</button>
		    <button data-target="#update-model"  data-toggle="modal"  class="btn btn-info btn-sm"  type="button"  ng-disabled="chosenItem==null">更新</button>
		    <button data-target="#delete-model"  data-toggle="modal"  class="btn btn-danger btn-sm"  type="button"  ng-disabled="chosenItem==null">删除</button>
		</div>

		<!-- 表格 -->
		<div mc-grid options="gridOptions"  source="dataSource.rows"  chosen="chosenItem" ></div>
		
		<!-- 分页 -->
		<span class="fright">
			<pagination total-items="dataSource.total"  ng-model="currentPage"  ng-change="pageChanged(SeachParam)"  max-size="maxSize" boundary-links="true" rotate="false" num-pages="numPages" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"  items-per-page="perPage"></pagination>
		</span>
		<!-- end -->
		
	</div>
</div>
<{/block}>

<{block name=ExtendJs}>
<script type="text/javascript" src="/static/js/json2.js"></script>
<script src="/static/js/angular.min.js"></script>
<script src="/static/js/mcGrid/Mc.Grid.js"></script>
<script src="/static/js/ui-bootstrap-tpls-0.11.0.js"></script>
<script type="text/javascript">
var GridApp=angular.module('GridModule', ['ui.mc.grid','ui.bootstrap']);

function GridCtrl($http,$scope) {
	$scope.maxSize = 5;     //默认分页显示数字按钮数目
	$scope.currentPage = 1;  //默认当前页
	$scope.perPage = 15;  //默认分页数
	$scope.baseUrl="/index.php?app=library&m=LibraryList&action=";
	$scope.dataUrl=$scope.baseUrl+"getList&start="+($scope.currentPage-1)*$scope.perPage+"&limit="+$scope.perPage;
	$scope.dataSource={};
	$scope.addItem={};
	$scope.chosenItem=null;

	//@TODO这个最好可以脱离smarty,用MVVC的service？
	$scope.op= <{$option}>;
 
	//配置搜索复合器
	$scope.combine=[
		{"key":"bid","name":"编号","type":"text","value":""},
		{"key":"name","name":"书名","type":"text"},
		{"key":"sort","name":"分类","type":"select","arr":$scope.op.category},
	];

	//配置表头 根据返回的数据格式@dataSource配置
	$scope.gridOptions={
	    columnDefs: [          	
    	    {"key":"B_ID","name":"编号","type":"id"},
    	    {"key":"B_Sort","name":"分类","type":"select","arr":$scope.op.category},
    	    {"key":"B_Name","name":"书名","type":"text"},
    	    {"key":"B_Author","name":"作者","type":"text"},
    	    {"key":"B_Publish","name":"出版社","type":"text"},
    	    {"key":"B_Price","name":"价格","type":"text"},
    	    {"key":"B_TotalNum","name":"总数量","type":"text"},
    	    {"key":"B_AvailNum","name":"库存","type":"text"},
    	    {"key":"B_BuyTime","name":"购买日期","type":"datetime"},
    	    {"key":"cnum","name":"借阅次数","type":"text"},
    	],
    	addBtn : {"label":"新增","nodeId":"add-model","postUrl":$scope.baseUrl+"add"},
    	updateBtn : {"label":"更新","nodeId":"update-model","postUrl":$scope.baseUrl+"update"},
    	deleteBtn : {"label":"删除","nodeId":"delete-model","postUrl":$scope.baseUrl+"del"},
    	pagination : {}
	}
	
	//分页
	$scope.pageChanged=function(SeachParam){
		$http({
		  url: $scope.baseUrl+"getList&start="+($scope.currentPage-1)*$scope.perPage+"&limit="+$scope.perPage,
		  method: "get",
		  params: SeachParam
		}).success(function(json){
		  if(json.status === 1) {
			  $scope.dataSource = json;
		  }else{
			  console.log("json.status状态值不正确或者获取数据失败!");
		  }
		});
	}
 
   
	
}
</script>
<{/block}>