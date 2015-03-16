#McGrid

> 基于angualr 的一个松耦合的表格编辑器,包含表格搜索组合器，表格、分页、更新、新增、删除等操作。

####Preface
最近工作在整理某系统的前端插件operamasks-ui过程中，为了加快工作效率。整理相关业务的页面，发现大部分都属于增删改的表格展示形式，稍微参考了opearmasks-ui的实现方式，结合angular的directive封装代码片段的方法。开始着手开发一个基于angular的Grid组件。

####Support
- [AngularJS v1.2.16](http://angularjs.org)
- [Bootstrap v3.2.0](http://getbootstrap.com)
- [bootstrap-datetimepicker v2.3.1](http://www.bootcss.com/p/bootstrap-datetimepicker)
- [angular-ui-bootstrap v0.11.0](http://angular-ui.github.io/bootstrap/) 

####Document
 下载项目，打开misc/demo/index.html，有详细配置文档。

####download
核心代码整理到lib目录下。

####Version
- 2015-03-07 v1.1
- 2015-03-09 v1.2
- 2015-03-13 v1.2.1
- 2015-03-16 v1.3

####ChangeLog

1. 去掉 mcInput，相关功能合并到mcGrid。

		    options={
		        combine : [
		            *key : 
		            *displayName : //原来是name
		            value :
		            type : //（text/select/datetime/）默认是text
		            arr : //下拉框的json数组
		            format：//datetime的配置
		            placeholder : //提示
		            width : //长度
		            class: //大小
		        ],
		        postUrl : //获取数据源的接口，搜索和分页都会用到
		        *columnDefs : [
		            *key :
		            *displayName: //原来是name
		            type : //（text/span/select/datetime/textarea/id/select2）默认是text，增加textarea，id尽量少用有可能废除
		            arr : //下拉框的json数组
		            format：//datetime的配置，判断时间为int可以顺便按照format转换格式
		            cellTemplate : 
		            placeholder : //提示
		            width : //长度
		            class: //大小
		            required : //检验
		        ],
		        addBtn : [
		            modalHead : //原来是label 
		            nodeId : //去掉
		            *postUrl :
		            postfn : //自定义function？
		        ],
		        updateBtn : [
		            modalHead : //原来是label 
		            nodeId :  //去掉
		            *postUrl :
		        ],
		        delBtn : [
		            modalHead : //原来是label 
		            nodeId :  //去掉
		            *postUrl :
		        ],
		        pagination: [
		            postUrl :
		            perPage : //原来limit
		            maxSize : 
		            setPage : //增加跳转jump？
		        ],//默认显示分页，可以配置false
		    }

2. mcmodel修改为mcmodal，modal-body和modal-footer相关代码整理到代码片段，增加modalfn来传递点击确定执行的function。具体可以参考以参数列表
3. mcGrid内部代码整理，去掉之前过多的ng-if判断，修改为`预处理`+`compile`来编译html模板的形式。
4. mcGrid的attr参数列表：

		.directive("mcGrid", function() {
		return {
			restrict: "EA",
			scope: {
				options: "=",
				source: "=?", //可不定义的
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
		
####TodoList
具体查看issues
		
		

