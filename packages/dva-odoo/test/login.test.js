import dvaOdoo from '../src/index';

import dva from 'dva';

describe('dva-odoo', () => {
  it('create login model ok', done => {
    create_login(done);
    create_login_namespace(done);
  });

  it('extend login model ok', done => {
    extend_login(done);
    done();
  });
});

const create_login = done => {
  const app = dva();
  let model = dvaOdoo({
    inherit: 'login',
    service: () => {
      {
        id: 1;
      }
    },
  });

  console.log(model);
  expect(model.namespace).toEqual('login');
  expect(model.state).toEqual({ sid: '', uid: 0 });

  done();
};

const create_login_namespace = done => {
  const app = dva();
  let model = dvaOdoo({
    inherit: 'login',
    namespace: 'login2',
    service: () => {
      {
        id: 1;
      }
    },
  });

  console.log(model);
  expect(model.namespace).toEqual('login2');
  expect(model.state).toEqual({ sid: '', uid: 0 });

  done();
};

import { call, put, select } from 'redux-saga/effects';

const extend_login = done => {
  const app = dva();

  let model = dvaOdoo({
    inherit: 'login',
    service: () => {
      {
        id: 1;
      }
    },
    extend: {
      state: {
        uname: 'un1',
      },

      effects: {
        *login_success({ payload }, { call, put, select }) {
          console.log('be overwrited');
          return 'overwrited';
        },
        *login_ok({ payload }, { call, put, select }) {
          console.log('new  effect method');
          return 'new method';
        },
      },
    },
  });

  console.log(model);
  //  console.log(model.effects)
  //  console.log(model.effects.login_success)

  expect(model.namespace).toEqual('login');
  expect(model.state).toEqual({ sid: '', uid: 0, uname: 'un1' });

  const gen = model.effects.login_success(
    { payload: {} },
    { call, put, select }
  );
  const s1 = gen.next();
  expect(s1).toEqual({ value: 'overwrited', done: true });

  const gen2 = model.effects.login_ok({ payload: {} }, { call, put, select });
  const s2 = gen2.next();
  expect(s2).toEqual({ value: 'new method', done: true });

  app.model(model);

  app.router(() => 1);
  app.start();

  const oldState = app._store.getState().login;
  expect(oldState).toEqual({ sid: '', uid: 0, uname: 'un1' });
  done();
};
