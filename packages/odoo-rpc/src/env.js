import modelCreator from '../src/models'

class Environment{
    static _register = {}
    
    constructor(options){
        const {rpc} = options
        this.rpc = rpc
        
        /*
        const env = new Proxy(this,{
            get(target, key){
                if(key in target){
                    console.log('env=',target,key,typeof(key))
                }
                else{
                    console.log('env 2=',target,key,typeof(key))
                }
            }
        })
        
        return env
        */
        
        
    }
    
    models(name){
        const model0 = Environment._register[name]
        if(model0){
            return model0
        }
        else{
            return modelCreator({name,rpc:this.rpc})
        }
    }
}

export default Environment



