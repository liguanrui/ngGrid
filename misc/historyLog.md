1. 去掉 mcImput，相关功能合并到mcGrid。
    具体的参数变化（蓝色：修改，红色：删除，绿色：新增）：
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
            nodeId : 
            *postUrl :
            postfn : //自定义function？
        ],
        updateBtn : [
            modalHead : //原来是label 
            nodeId : 
            *postUrl :
        ],
        delBtn : [
            modalHead : //原来是label 
            nodeId : 
            *postUrl :
        ],
        pagination: [
            postUrl :
            perPage : //原来limit
            maxSize : 
            setPage : //增加跳转jump？
        ],//默认显示分页，可以配置false
    }