import Environment from '../src/env'


describe('jsonrpc', () => {
  it('all ok', (done) => {
    test(done)

  });
});



const test = async (done) => {
    const env = new Environment()
    
    console.log(env)
    
    const Partner = env.models('res.partner')
    
    console.log(Partner)

    Partner.search_read({domain:[], fields:['name']})
    
    const p = Partner.browse(1)
    console.log( p )

    
    done()
}



