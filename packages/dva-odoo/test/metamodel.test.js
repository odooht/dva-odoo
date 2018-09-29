import dvaOdoo from '../src/index';

import dva from 'dva';

describe('dva-odoo', () => {
  it('create base model ok', done => {
    create_base(done);
    done()
  });

  it('base model read ok', done => {
    test_read(done);
    done()
  });
});

const create_base = done => {
  const app = dva();
  let model = dvaOdoo({
    model: 'res.partner',
    namespace: 'testbase',
    inherit: 'base',
    service: () => {
      {
        id: 1;
      }
    },
  });

//  console.log(model);
  
  expect(model.namespace).toEqual('testbase');
  expect(model.state).toEqual({ ids: [], id: 0 });

  done();
};

import { call, put, select } from 'redux-saga/effects';

const test_read = done => {
  const app = dva();
  const model = dvaOdoo({
    model: 'res.partner',
    namespace: 'testbase',
    inherit: 'base',
    service: (token, params) => {
//      console.log('odoodata:',token, params);
      const {body: {params: {kwargs:{ context:{mock_react_api} }}}} = params
      console.log('odoodata:',mock_react_api);
      
      switch(mock_react_api){
        case 'testbase/multiRead':
        case 'testbase/read':
          return {result: [{id:1,name:'n1'},
                           {id:2,name:'n2'},
                           {id:3,name:'n3'}
                          ]}
        case 'testbase/search':
          return {result: [1,2]}
        default:
          return {result: 1 }
      }
    },
  });

  //console.log(model);
  expect(model.namespace).toEqual('testbase');
  expect(model.state).toEqual({ ids: [], id: 0 });

  const login = dvaOdoo({
    inherit: 'login',
    service: () => {
      return { result: {sid: 'sid1', uid:1, status: 'ok'}  }
    }
  });

  const odooData = dvaOdoo({
    inherit: 'odooData',
  });


  app.model(login);
  app.model(odooData);
  app.model(model);
  
  app.router(() => 1);
  app.start();

  const state0 = app._store.getState();
  console.log(state0)
  expect(state0.login).toEqual({ sid: '', uid: 0 });
  
  app._store.dispatch({
    type: 'login/login',
    payload: { login: 'admin', password: '123', type: 'account' }
  })
  .then(res => {
    const state2 = app._store.getState();
    console.log(state2)
    expect(state2.login).toEqual({ sid: 'sid1', uid: 1, status: 'ok' });
      
    app._store.dispatch({
      //type: 'testbase/read',
      //payload: {id:[1,2]}
      type: 'testbase/search',
      payload: {domain:[]},
      callback: {type:'www', params:{}}
      
    })
    .then( res => {
      const state3 = app._store.getState();
      console.log(state3)
      expect(state3.odooData).toEqual({
        'res_partner': {
          1:{ id:1, name:'n1' },
          2:{ id:2, name:'n2' },
          3:{ id:3, name:'n3' },
        }
      });
      
      expect(state3.testbase).toEqual({ids:[1,2], id:0})

      done();
    
    })
      
  });

  

  done();
};
