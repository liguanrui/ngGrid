#McGrid

> ����angualr ��һ������ϵı��༭��,��������������������񡢷�ҳ�����¡�������ɾ���Ȳ�����

####Preface
�������������ĳϵͳ��ǰ�˲��operamasks-ui�����У�Ϊ�˼ӿ칤��Ч�ʡ��������ҵ���ҳ�棬���ִ󲿷ֶ�������ɾ�ĵı��չʾ��ʽ����΢�ο���opearmasks-ui��ʵ�ַ�ʽ�����angular��directive��װ����Ƭ�εķ�������ʼ���ֿ���һ������angular��Grid�����

####Support
- [AngularJS v1.2.16](http://angularjs.org)
- [Bootstrap v3.2.0](http://getbootstrap.com)
- [bootstrap-datetimepicker v2.3.1](http://www.bootcss.com/p/bootstrap-datetimepicker)
- [angular-ui-bootstrap v0.11.0](http://angular-ui.github.io/bootstrap/) 

####Document
 ������Ŀ����misc/demo/index.html������ϸ�����ĵ���

####download
���Ĵ�������libĿ¼�¡�

####Version
- 2015-03-07 v1.1
- 2015-03-09 v1.2
- 2015-03-13 v1.2.1
- 2015-03-16 v1.3

####ChangeLog

1. ȥ�� mcInput����ع��ܺϲ���mcGrid��

		    options={
		        combine : [
		            *key : 
		            *displayName : //ԭ����name
		            value :
		            type : //��text/select/datetime/��Ĭ����text
		            arr : //�������json����
		            format��//datetime������
		            placeholder : //��ʾ
		            width : //����
		            class: //��С
		        ],
		        postUrl : //��ȡ����Դ�Ľӿڣ������ͷ�ҳ�����õ�
		        *columnDefs : [
		            *key :
		            *displayName: //ԭ����name
		            type : //��text/span/select/datetime/textarea/id/select2��Ĭ����text������textarea��id���������п��ܷϳ�
		            arr : //�������json����
		            format��//datetime�����ã��ж�ʱ��Ϊint����˳�㰴��formatת����ʽ
		            cellTemplate : 
		            placeholder : //��ʾ
		            width : //����
		            class: //��С
		            required : //����
		        ],
		        addBtn : [
		            modalHead : //ԭ����label 
		            nodeId : //ȥ��
		            *postUrl :
		            postfn : //�Զ���function��
		        ],
		        updateBtn : [
		            modalHead : //ԭ����label 
		            nodeId :  //ȥ��
		            *postUrl :
		        ],
		        delBtn : [
		            modalHead : //ԭ����label 
		            nodeId :  //ȥ��
		            *postUrl :
		        ],
		        pagination: [
		            postUrl :
		            perPage : //ԭ��limit
		            maxSize : 
		            setPage : //������תjump��
		        ],//Ĭ����ʾ��ҳ����������false
		    }

2. mcmodel�޸�Ϊmcmodal��modal-body��modal-footer��ش�����������Ƭ�Σ�����modalfn�����ݵ��ȷ��ִ�е�function��������Բο��Բ����б�
3. mcGrid�ڲ���������ȥ��֮ǰ�����ng-if�жϣ��޸�Ϊ`Ԥ����`+`compile`������htmlģ�����ʽ��
4. mcGrid��attr�����б�

		.directive("mcGrid", function() {
		return {
			restrict: "EA",
			scope: {
				options: "=",
				source: "=?", //�ɲ������
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
����鿴issues
		
		

