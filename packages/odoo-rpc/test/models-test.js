//import Environment from '../src/env'
import models from '../src/models'
import RPC from '../src/rpc'


describe('jsonrpc', () => {
  it('all ok', (done) => {
    test_browse_multi(done)

  });
});


const get_rpc = async () => {
    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    const rpc = new RPC({host, db})
    const data = await rpc.login({login:'admin', password: '123'})
    //console.log(data)
    return rpc
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


const test_browse_multi = async (done) => {
    //const env = new Environment()
    
    const rpc = await get_rpc()
    
    const fs = ['name','partner_id','compnay_id','category_id']
    
    const fields0 = await fields_get(rpc, 'res.users',fs,['type','relation'])
    
    const fields = Object.keys(fields0).reduce( (acc,cur)=>{
        if(fs.indexOf(cur)>=0 ){
            acc[cur] = fields0[cur]
        } 
        return acc
    },{})

    const Users = models({model:'res.users', rpc , fields})
//    console.log(Users)
    const u0 = await Users.call('search',[[['id','>',30]]])

    const users = await Users.search( [['id','>',30]])
    console.log(users)
    console.log(users)
    

    
//    console.log(Users._instances)

    com = u1.getattr('com_id',1)
    
    u1.getattr('com_id').getattr('name')
    u1.getattr('com_id').getattr('tels')
    com.getattr('name')
    u1.getattr('name')



    print u1.name
    prin u1.age


    u1.name
    
    u1.getattr('name')





    const uu2 = await Users.search( [['id','>',30]])
    console.log(uu2)

    
    console.log(Users._records)
    const uu23 = await Users.search( [['id','>',28]], ['email'])
    console.log(Users._records)
    console.log(uu23)
    
    uu23[0]
    
    
   


    let u = Users.browse([1,2,3])
    console.log(u)
    console.log(u.name)
    
    const sss = u.unlii({n:2},222,3,4,5)
    console.log(sss)
    

    console.log(u[1])
    console.log(u[2])
    console.log(u[2].name)
    
    const ttt = await u[2].tels
    
    console.log(ttt)

    const sss2 = u[2].unlii({n:2},222,3,4,5)
    console.log(sss2)

*/    
    done()
}



