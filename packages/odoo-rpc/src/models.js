/*

TBD:  2018-11-29
attr(). m2m no flash

*/


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

const modelCreator = async (options)=>{
    const {model, fields: fs0, rpc, env} = options
    
    const fs = fs0 ?  fs0 : ['id','name']
    
    const get_fields = async ()=>{
        const fields0 = await fields_get(rpc, model,fs,['type','relation'])
        return Object.keys(fields0).reduce( (acc,cur)=>{
            if(fs.indexOf(cur)>=0 ){
                acc[cur] = fields0[cur]
            } 
            return acc
        },{})
    }
    
    const  fields = await get_fields()
    
    class cls {
//        static _name = model
//        static _rpc = rpc
//        static _env = env
//        static _fields = fields
//        static _records = {}
//        static _instances = {}
        
        constructor(ids,vals){
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
        
        // only for multi
        list(){ // only for multi
            return Object.values( this._instances )
        }
        
        // only for multi
        byid(id){ // only for multi
            return this._instances[id]
        }
        
        static async env(relation){
            let ref_cls = await this._env[relation]

            if(!ref_cls){
                ref_cls = await modelCreator({
                    model:relation, 
                    rpc: cls._rpc, 
                    env:cls._env
                })
                this._env[relation] = ref_cls
            }
            
            return ref_cls
        
        }
        
        // only for single
        attr(attr,flash=0 ){ // only for single
            const raw = ( cls._records[this._id] || {} )[attr]
            const {type,relation} = cls._fields[attr] || {}
            
            if(['many2one','one2many', 'many2many'].indexOf(type)<0 ){
                return raw
            }
            
            return cls.env(relation).then(ref_cls=>{
              if( type === 'many2one'){
                if(flash){
                    return ref_cls.read(raw[0])
                }
                
                const [id, name] = raw
                const vals = {id,name,display_name:name}
                const ref_ins = new ref_cls(raw[0],vals)
                return ref_ins
              }
              else{
                //  TBD flash=1
                return ref_cls.read(raw)
              }
                
            })
            
            
        }
        
        static async call(method, args=[], kwargs={} ){
            const params = {
                model:this._name,
                method, args, kwargs
            }
            const data = await this._rpc.call(params)
            const {code} = data
            
            if(!code){
                const {result} = data
                return result
            }
            
            // TBD error save in class
            return null 
        }
        
        static list2instance(result){
            const res = result.reduce((acc, cur)=>{
                acc[cur.id] = ( new  this(cur.id, cur) )
                return acc
            },{})
                
            const ids = Object.keys(res)
            const instance = new this(ids)
                
            return instance
        }
        
        static async search(domain){
            const fields = Object.keys(cls._fields)
            const data = await cls.call('search_read',[domain,fields ])
            return this.list2instance( data ? data : [] )
        }
        
        static async read(ids){
            const fields = Object.keys(cls._fields)
            const data0 = await cls.call('read',[ids,fields ])
            const data = data0 ? data0 : []
            
            if (typeof ids ==='object'){
                return this.list2instance( data)
            }
            else{
                const vals = data.length ? data[0] : {}
                return new cls(ids, vals)

            }
        }
        
        static async create(vals){
            const data = await cls.call('create',[ vals ])
            if(data){
                return cls.read(data)
            }
            return data
        }
        
        static async write(id, vals){
            const data = await cls.call('write',[ id, vals ])
            if(data){
                return cls.read(id)
            }
            return data
        }

        async write( vals){
            return cls.write(this._id, vals)
        }
        
        static async unlink(id){
            const data = await cls.call('unlink',[ id ])
            if(data){
                //TBD
                return data
            }
                
            return data
                
        }

        async unlink( vals){
            return cls.unlink(this._id, vals)
        }
                
    }
    
    cls._name = model
    cls._rpc = rpc
    cls._env = env
    cls._fields = fields
    cls._records = {}
    cls._instances = {}


    
    Object.defineProperty(cls, 'name', {value: model, configurable: true} )
  
    return cls

}

export default modelCreator

