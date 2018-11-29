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

const env = { }

const get_model = async ({ model,rpc, fields} ) => {
    let cls = env[model]
    if(cls){
        return cls
    }
    cls = await models({model, rpc , fields, env})
    env[model] = cls
    return cls
    
}


const test_browse_multi = async (done) => {
    //const env = new Environment()
    const rpc = await get_rpc()
    const fields = ['name','partner_id','company_id','category_id']
    const Users = await get_model({model:'res.users', rpc , fields})

    const fields2 = ['name','email']
    const Comp = await get_model({model:'res.company', rpc , fields:fields2 })

    const fields3 = ['name']
    const CTG = await get_model({model:'res.partner.category', rpc , fields:fields3 })

//    console.log(Users)
//    console.log(Comp)

    const users = await Users.search( [['id','>',30]])
    console.log(users)
//    console.log(Users)
    const users2 = await Users.search( [['id','<',9]])
    console.log(users2)
//    console.log(Users)
    
    const us2 = users2.list() 
    const usr6 = users2.byid(6)
    console.log( users2.byid(6) )
    
    console.log( us2 )
    
    console.log( us2[1].attr('name') )
    const comp = await us2[1].attr('company_id',1) 
    
    console.log( comp )
    console.log( comp.attr('name') )
    console.log( comp.attr('email') )
    console.log( Comp )
    //console.log( Users._records )
    
    const ctgs = await usr6.attr('category_id') 
    console.log( ctgs )
    
    const ctg1 = ctgs.list()[0]
    console.log( ctg1 )
    
    console.log(ctg1.attr('name'))
    
/*
    
    const u0 = await Users.call('search',[[['id','>',30]]])
//    console.log(Users._instances)

    const uu2 = await Users.search( [['id','>',30]])
    console.log(uu2)

    
    console.log(Users._records)
    const uu23 = await Users.search( [['id','>',28]], ['email'])
    console.log(Users._records)
    console.log(uu23)
    

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



