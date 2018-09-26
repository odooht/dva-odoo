import baseModel from './models/baseModel';

const jsonrpc = (result) => {
  return {
      jsonrpc: 2.0,
      id: 1,
      result,
    }
}

function jsonApi(  params, models ) {
    const {params:{args, kwargs}} = params;
    const { context = {} } = kwargs;
    const { mock_react_api } = context;
    const [model, method] = mock_react_api.split('/');

    const mock_model0 = models[model];
    const mock_model = mock_model0 ? mock_model0 : baseModel();

//    console.log('mock,', model, mock_model, method )

    const res = mock_model[method]( ...args, kwargs);
    return jsonrpc(res);

}


function jsonUserLogin( params, loginUsers ){
  const {params:{ password, login, type }} = params;
  const user = loginUsers[login] ;

  if( user ){
    const {password: psw, sid='', uid=0, name='' } = user;
    if( password === psw ){
      return jsonrpc({ sid, name, uid, status: 'ok' });
    }
  }

  return jsonrpc({ status: 'error'})
}


export default {
  jsonApi,
  jsonUserLogin
}
