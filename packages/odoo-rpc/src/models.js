import RPC from '../src/rpc'

const get_rpc = () => {
    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    return new RPC({host, db})
}


const rpc_odoo = async ()=>{

              const rpc = get_rpc()
              const login    ='admin'
              const password ='123'
              await rpc.login({login, password})
              
              
    const model  ='res.partner'
    const method ='fields_get'
    const args   = []
    const kwargs = {}
    const params = { model, method, args, kwargs }
    const data = await rpc.call(params)
    
    return data
}


const _search = async (cls, domain, fields) =>{
    const fs = fields || Object.keys(cls._fields)
    const data = await cls.call('search_read',[domain,fs ])
    const {code} = data
    
    if(!code){
        const {result} = data
        const res = result.reduce((acc, cur)=>{
            acc[cur.id] = ( new  cls(cur.id, cur) )
            //const old = cls._records[cur.id] || {}
            //cls._records[cur.id] = {...old, ...cur}
            return acc
        },{})
                
        const ids = Object.keys(res)
        const instance = new cls(ids)
                
        return instance
                
    }
    return new cls( [] )
            

}

const fields_get = async (rpc, model,allfields,attributes)=>{
        const method = 'fields_get'
        const data = await rpc.call({ model, method,args:[allfields,attributes] })
        const {code} = data
        if(!code){
            const {result} = data
            return result
        }
        else{
            return {}
        }
}


const creator = async (options)=>{
    const {model, fields: fs, rpc, env} = options
    
    const fields0 = await fields_get(rpc, model,fs,['type','relation'])

    const fields = Object.keys(fields0).reduce( (acc,cur)=>{
        if(fs.indexOf(cur)>=0 ){
            acc[cur] = fields0[cur]
        } 
        return acc
    },{})
    

    class cls {
        static _name = model
        static _rpc = rpc
        static _fields = fields
        static _records = {}
        static _instances = {}
        
        constructor(ids,vals){
            this._env = env
            if(typeof(ids) === 'object' ){
                this._ids = ids
                this._instances = ids.reduce((acc,cur)=>{
                    acc[cur] = new cls(cur)
                    return acc
                },{})
            }
            else{
                this._id = ids
                if(vals){
                    const old = cls._records[ids] || {}
                    cls._records[ids] = {...old, ...vals}
                }
                
                cls._instances[ids] = this
            }
            
        }
        
        static async call(method, args=[], kwargs={} ){
            const params = {
                model:this._name,
                method, args, kwargs
            }
            return this._rpc.call(params)
        }

        static async search(domain, fields){
            return _search(this, domain, fields)
        }
        
        static browse(id){
            /*
            if (typeof id ==='object'){
                return null
            }
            else{
                const instance = cls._instances[id] || new cls(id)
                return instance
            }*/
        }
        
        list(){
            //console.log(this._instances)
            return Object.values( this._instances )
        }
        
        byid(id){
            // for multi
            return this._instances[id]
        }

        attr(attr,flag=0 ){
            // attr is o2m or m2m .... TBD

            const raw = ( cls._records[this._id] || {} )[attr]
            const {type,relation} = cls._fields[attr]
            if(['many2one','one2many', 'many2many'].indexOf(type)<0 ){
                return raw
            }
            
            const ref_cls = this._env[relation]
            
            if( type === 'many2one'){
                const [id, name] = raw
                const vals = {id,name,display_name:name}
                const ref_ins = new ref_cls(raw[0],vals)
                //ref_cls._records = {id:vals}
                return ref_ins
            }
            else{
                
            //console.log(type,relation, ref_cls)
                return ref_cls.search([['id','in', raw ]],['name'])
                
                //const ref_ins = new ref_cls(raw)
                //return ref_ins
               // return raw
            }
        }
        
        
    }
    
    Object.defineProperty(cls, 'name', {value: model, configurable: true} )
  
    return cls

}



export default creator

