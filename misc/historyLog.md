1. ȥ�� mcImput����ع��ܺϲ���mcGrid��
    ����Ĳ����仯����ɫ���޸ģ���ɫ��ɾ������ɫ����������
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
            nodeId : 
            *postUrl :
            postfn : //�Զ���function��
        ],
        updateBtn : [
            modalHead : //ԭ����label 
            nodeId : 
            *postUrl :
        ],
        delBtn : [
            modalHead : //ԭ����label 
            nodeId : 
            *postUrl :
        ],
        pagination: [
            postUrl :
            perPage : //ԭ��limit
            maxSize : 
            setPage : //������תjump��
        ],//Ĭ����ʾ��ҳ����������false
    }