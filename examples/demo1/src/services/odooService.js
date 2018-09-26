import request  from '@/utils/request'

import proxy from '../../mock'

import odoorc from '../../.odoorc'

const mock = process.env.MOCK === 'true';

async function mockRequest( url, params ){
    const url1 = url.split('?')[0]
    const fn = proxy['POST '+url1]
    const response = new Promise( (resolve, reject) => {
      fn(params, { send(data){
        const { result, error } = data;
        if(result){
          resolve(data)
        }
        else{
          reject(data)
        }
      }})
    })

    return response.then( (data) => { return data }).catch( (data) => { return data } )
}

async function login( params0 ){
  const { body } = params0;
  const { params: params1 } = body;

  const {database:{name:db}} = odoorc

  const params = {...params0, body:{ ...body, params: { ...params1,db}}}

  console.log(params)

  const url = '/api/json/user/login';
  const req = mock ? mockRequest : request;
  return req(url, params)
}

async function call( token, params ){
  const now = Date.now();
  const url = `/api/json/api?session_id=${token}&_now=${now}`;

  const req = mock ? mockRequest : request;
  return req(url, params)
}


export default {
  login,
  call
}
