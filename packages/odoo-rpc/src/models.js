import RPC from '../src/rpc'

const get_rpc = () => {
    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    return new RPC({host, db})
}

const _browse_multi = (cls, ids)=>{
    const instance = new cls(ids)
    
    return new Proxy(instance, {
        get( target ,key ){
            console.log('in', key, typeof(key) )
            return target[key]
            
            
            
            /*
            if(key==='name' || key==='tels'){
                return null
            }
            else if( target.ids.indexOf( parseInt(key) )>=0 ){
                return _browse(cls,parseInt(key))
            }
            else{
                return ( kwargs, ...args ) => {
                    return cls[key](kwargs, target.ids, ...args)
                }
            }
            */
            
        }
    })
    
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

const _browse = (cls, id)=>{
    const instance = cls._instances[id] || new cls(id)
    
    return new Proxy(instance, {
        get( target ,key ){
            console.log('proxy=',target, key)
            
            if(key==='name'){ 
                return cls._records[target._id][key]
            }
            else if( key==='tels'){
                return rpc_odoo()
            }
            else {
                return key
            }
        }
    });
}


const creator = (options)=>{
    const {model, fields, rpc} = options
    class _Model {
        static _name = model
        static _rpc = rpc
        static _fields = fields
  
        static _records = {}
        static _instances = {}

        constructor(id){
            this._id = id
            _Model._instances[id] = this
        }
        
        static async call(method, args=[], kwargs={} ){
            const params = {
                model:this._name,
                method, args, kwargs
            }
            return this._rpc.call(params)
        }

        static async search(domain, fields){
            //console.log(fields, this._fields)
            const fs = fields || Object.keys(this._fields)
            const data = await this.call('search_read',[domain,fs ])
            const {code} = data
            if(!code){
                const {result} = data
                const res = result.reduce((acc, cur)=>{
                    acc[cur.id] = ( new  this(cur.id) )
                    const old = this._records[cur.id] || {}
                    this._records[cur.id] = {...old, ...cur}
                    return acc
                },{})
                
                const ids = Object.keys(res)
                return _browse_multi(this, ids)
                
                //return res
                
                
            }
            return null
            
        }
        
        getattr(attr,flag=0 ){
            return _Model._records[this._id][attr]
        }
    
/*
        static browse(id){
            if (typeof id ==='object'){
                return _browse_multi( this, id)
            }
            else{
                return _browse( this, id)
            }
        }
*/
    }
    
    Object.defineProperty(_Model, 'name', {value: model, configurable: true} )
/*        
    
    const Model = new Proxy( _Model, {
      get( target, key ){
            console.log(' cls',key, typeof(key))
            return _Model[key]
        
        if( key in target  ){
            return _Model[key]
        }
        if( key in Proxy  ){
            console.log('in proxy',target, Proxy, key)
            return _Model[key]
        }
        else{
            console.log('not in',target, Proxy, key)
        }
        
        if( key in target  ){
            return _Model[key]
        }
        else{
            return (kwargs, ...args )=>{
                const params = {
                    model:target._name,
                    method: key,
                    args, kwargs
                }
                
                
                return [ target._name,key, args, kwargs ]
            }
        }
        
      }

    })
  
    return Model


*/
  
    return _Model

}



const test = () => {
    users = {}
    odooData =  users.odooData
    
    const get_ids = ()=> {
      const ids = Object.keys(users).reduce((acc,key)=>{
        acc.push(users[key].id)
        return acc
        
      },[] )
      return ids
    }
    
    const flash = ( fields=['doing_table_ids'] ) => {
      const ids = Object.keys(users).reduce((acc,key)=>{
        const user = users[key]
        const doing_table_ids = user.attr('doing_table_ids').then(tbls=>{
            odooData.save('og.table',tbls)
        })
        
        user = {
            id: user.id, 
            name: user.attr('name'),
            doing_table_ids
        
        }
        
        odooData.save('res.users',user)
        
        
      },[] )
      return 1
    }


}


export default creator

