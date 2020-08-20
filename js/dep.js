class Dep {
    constructor () {
        //存储观察者
        this.subs = [];
    }
    //添加观察者并约定每个观察者必须有update方法
    addSub (sub) {
        if(!sub || !sub.update) return
        this.subs.push(sub);
    }
    //发布通知
    notify () {
        this.subs.forEach(sub=>{
            sub.update()
        })
    }
}