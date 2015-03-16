var app = angular.module('myApp', ['ui.mc.grid', 'ui.bootstrap']);
app.controller('MyCtrl1',function($scope) {
    $scope.dataSource = {rows:[{name: "Moroni",age: 50},
											{name: "Tiancum",age: 43},
											{name: "Jacob",age: 27},
											{name: "Nephi",age: 29},
											{name: "Enos",age: 34},],
								};
	console.log($scope.dataSource);
    $scope.gridOptions ={columnDefs:[{key: "name",name: "姓名",type: "text"},
												   {key: "age",name: "年龄",type: "text"}]};
});
 
 
app.controller('MyCtrl2',function($scope) {
    
	$scope.baseUrl ="http://sharkcan.duapp.com/index.php/Book/";
	$scope.dataSource={};
	$scope.chosenItem=null;
	$scope.op={};
	$scope.op.category ={};
    //配置搜索复合器
	$scope.inputOptions={
        combine: [
    		//{key:"bid",name:"编号",type:"text"},
    		{key:"name",name:"书名",type:"text"},
    		{key:"sort",name:"分类",type:"select",arr:$scope.op.category},
	    ],
	    postUrl : $scope.baseUrl+"getList",
    }

	//配置表头 根据返回的数据格式@dataSource配置
	$scope.gridOptions={
	    columnDefs: [          	
    	    {key:"B_ID",name:"编号",type:"id"},
    	    {key:"B_Sort",name:"分类",type:"select",arr:$scope.op.category},
    	    {key:"B_Name",name:"书名",type:"text"},
    	    {key:"B_Author",name:"作者",type:"text"},
    	    {key:"B_Publish",name:"出版社",type:"text"},
    	    {key:"B_Price",name:"价格",type:"text",cellTemplate:"<span ng-if='row.B_Price'>￥{{row.B_Price}}</span>"},
    	    {key:"B_TotalNum",name:"总数量",type:"text"},
    	    {key:"B_AvailNum",name:"库存",type:"text"},
    	    {key:"B_BuyTime",name:"购买日期",type:"datetime"},
    	    {key:"cnum",name:"借阅次数",type:"id"},
    	],
    	addBtn : {label:"新增",nodeId:"add-model",postUrl:$scope.baseUrl+"insert"},
    	updateBtn : {label:"更新",nodeId:"update-model",postUrl:$scope.baseUrl+"update"},
    	deleteBtn : {label:"删除",nodeId:"delete-model",postUrl:$scope.baseUrl+"del"},
    	pagination : {postUrl:$scope.baseUrl+"getList"},
	}
});