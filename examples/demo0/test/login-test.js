import model from '../src/models/odooLogin';
import loginMock from '../mock/loginModel';

import dva from 'dva';

describe('dva-odoo', () => {
  it('login model init ok', done => {
//    init_login(done);
    done();
  });
  it('login model exec ok', done => {
    exec_login(done);
    done();
  });

});

const init_login = done => {
  const app = dva();

  console.log(model);
  expect(model.namespace).toEqual('login');
  expect(model.state).toEqual({ sid: '', uid: 0 });

  done();
};

const exec_login = done => {
  const app = dva();

  //console.log(model);
  expect(model.namespace).toEqual('login');
  expect(model.state).toEqual({ sid: '', uid: 0 });

  app.model(model);
  app.router(() => 1);
  app.start();

  const sss = app._store.getState().login
  console.log(sss)

  const params = { login:'admin', password:'123', type: 'account'}

  const tocall= app._store.dispatch({
    type:'login/login',
    payload:params
  })

  tocall.then( res => {
    const st2 = app._store.getState().login
    const {uid, sid, name } = loginMock.records['admin']
    expect(st2).toEqual( {uid, sid, name, status: 'ok' }  )
    done();
  })


};

