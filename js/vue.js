class Vue {
    constructor (options) {
        // 1.- 接收初始化参数
        this.$options = options || {};
        this.$data = options.data || {};
        this.$el = typeof(options.el) === 'string' ? document.querySelector(options.el) : options.el;
        // 2.- 把data中的成员注入到Vue实例,并且把data中的成员转成getter/setter
        this._proxyData(this.$data);
        // 3.- 负责调用observer监听data中所有属性的变化,当属性变化的时候更新视图
        new Observer(this.$data);
        // 4.- 负责调用compiler解析指令/插值表达式
        new Compiler(this);
    }
    //代理data中的数据
    _proxyData (data) {
        //遍历data中的所以属性
        Object.keys(data).forEach(key=>{
            //把data属性的get和set注入到Vue实例中
            Object.defineProperty(this,key,{
                enumerable : true,
                configurable : true,
                get () {
                    return data[key];
                },
                set (newValue) {
                    if(newValue !== data[key]){
                        data[key] = newValue
                    }
                }
            })
        })
    }
    set (object , propertyName , value){
        object[propertyName] = value;
        // 2.- 把data中的成员注入到Vue实例,并且把data中的成员转成getter/setter
        this._proxyData(this.$data);
        // 3.- 负责调用observer监听data中所有属性的变化,当属性变化的时候更新视图
        new Observer(this.$data);
        // 4.- 负责调用compiler解析指令/插值表达式
        new Compiler(this);
    }
}