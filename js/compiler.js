class Compiler {
    constructor (vm) {
        this.vm = vm;
        this.el = vm.$el;
        this.compile(this.el);
    }

    //遍历对象中所有节点,并判断节点是文本节点还是元素节点
    //eg: <p class="lucy"> Hello,World </p>
    //Hello,World属于文本节点
    //p属于元素节点
    //class="lucy"属于属性节点
    compile (el) {
        //注意这里应该是childNodes而不是children
        //childNodes返回的是节点的第一层子节点集合，包括元素节点、文本节点还有属性节点。
        //children返回的只是节点的第一层元素节点集合。
        //返回的是一个伪数组
        let childNodes = el.childNodes;
        Array.from(el.childNodes).forEach(node=>{
            if(this.isTextNode(node)){
                //处理文本节点
                this.compileText(node)
            }else if (this.isElementNode(node)){
                //处理元素节点
                this.compileElement(node)
            }
            //判断node节点是否有子节点,如果有递归调用compile
            if(node.childNodes && node.childNodes.length){
                this.compile(node);
            }
        })
    }

    //解析元素节点中的属性及指令
    compileElement (node) {
        Array.from(node.attributes).forEach(attr=>{
            if(this.isDirective(attr.name)){
                const arrtName = attr.name.substr(2);// v-text => text
                const key = attr.value;// msg
                this.update(node,key,arrtName);//this. 函数内部都会指向this这个Compiler类
            }
        })
    }

    //解析函数
    update (node,key,arrtName) {
        //不同的指令调用不同的方法
        //this[`${arrtName}Updater`] && this[`${arrtName}Updater`](node,key,this.vm[key]); //这样调用函数内部的this是指向Compiler类的
        const updater = this[`${arrtName}Updater`];
        updater.call(this,node,key,this.vm[key]);//这样调用需要同call改变this指向Compiler
    }

    //处理v-text指令
    textUpdater (node, key ,text) {
        node.textContent = text;
        //视图更新
        new Watcher(this.vm,key,(oldValue,newData)=>{
            node.textContent = newData;
        })
    }

    //处理v-model指令
    modelUpdater (node, key ,value) {
        node.value = value;
        node.oninput = (newValue)=>{
            if(node.value === value) return;
            this.vm[key] = value = node.value;
            console.log(key,this.vm[key]);
        }
        //视图更新
        new Watcher(this.vm,key,(oldValue,newData)=>{
            node.value = newData;
        })
    }

    //解析文本节点中的插值表达式
    compileText (node) {
        // console.dir(node);
        const reg = /\{\{(.+?)\}\}/g;
        let value = node.textContent;
        if(reg.test(value)){
            value.replace(reg,(x,$1)=>{
                const key = $1.trim();
                //利用闭包缓存最初是的模板值
                const val = RegExp.$_;
                // 有多个插值表达式时
                node.textContent = node.textContent.replace(x,this.vm[key]);
                // 利用闭包,Watcher在此处更新视图
                new Watcher(this.vm,key,(oldValue,newData)=>{
                    let textContent = val; 
                    //把旧的数据替换成新的数据
                    textContent.replace(reg,(x,$1)=>{
                        const key = $1.trim();
                        // 有多个插值表达式时
                        textContent = textContent.replace(x,this.vm[key]);
                    })
                    node.textContent = textContent;
                })
            })
        }
    }

    //判断元素属性是否是指令
    isDirective (attrName) {
        return attrName.startsWith('v-');
    }

    //判断节点是否是文本节点
    isTextNode (node) {
        return node.nodeType === 3;
    }

    //判断节点是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1;
    }
}