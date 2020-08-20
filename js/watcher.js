class Watcher {
    constructor (vm,key,cb) {
        this.vm = vm;
        this.key = key;
        //回调函数负责更新视图
        this.cb = cb;
        //把当前的watcher对象记录到dep类的静态属性target中
        Dep.target = this;
        //vm[key]会触发属性的get方法,在get方法中会调用addSub 
        //Dep对象的作用是收集依赖，每一个属性都会对应一个 Dep 对象，当属性变化时会触发set调用 Dep 对象的 notify 方法发送通知(循环触发watcher对象的update)更新视图。
        this.oldValue = vm[key];
        //为了避免重复调用addSub,target要置为空
        Dep.target = null; 
    }
    //更新视图
    update () {
        const newValue = this.vm[this.key];
        if(newValue === this.oldValue) return;
        this.cb(this.oldValue,newValue);
        //新的数据在下次变更的时候就是旧的数据了
        this.oldValue = newValue;
    }
}