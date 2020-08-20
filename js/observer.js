class Observer {
    constructor ($data) {
        this.walk($data)
    }
    walk ($data) {
        //data必须是object
        if(!$data || typeof($data) !== 'object') return
        Object.keys($data).forEach(key=>{
            this.defineReactive($data,key,$data[key]);
        })
    }
    defineReactive (obj ,key, value) {
        this.walk(value);
        let self = this;
        let dep = new Dep()
        Object.defineProperty(obj,key,{
            enumerable : true,
            configurable : true,
            get (key) {
                //这行代码会在实例化Watcher的时候被触发
                Dep.target && dep.addSub(Dep.target); 
                return value
            },
            set (newValue) {
                if(newValue !== value){
                    value = newValue;
                    self.walk(newValue);
                    //发送通知
                    dep.notify();
                }
            }
        })
    }
}