import modelCreator from '../src/models'
import RPC from '../src/rpc'

const create_env = (models, rpc )=>{
    const env = {}
    for(const mdl in models ){
        const fields = models[mdl]
        env[mdl] = modelCreator({model: mdl, fields, rpc, env })
    }
    
    return env
    
        
}

class Odoo {
    constructor(options){
        const { host,db,models } = options
        const rpc = new RPC({ host,db })
        this._rpc = rpc
        this._models = models
        this._env = null
    }

    async login(params){
        const data = await this._rpc.login(params )
        if( ! this._env){
            this._env = create_env(this._models, this._rpc)
        }
        
        return data
    }
    
    async logout(){
        return this._rpc.logout()
    }
    
    async env(relation){
            let ref_cls = await this._env[relation]

            if(!ref_cls){
                ref_cls = await modelCreator({
                    model:relation, 
                    rpc: this._rpc, 
                    env:this._env
                })
                this._env[relation] = ref_cls
            }
            
            return ref_cls
        
    }

}

export default Odoo
