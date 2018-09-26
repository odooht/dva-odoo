import dvaOdoo from '../src/index';

import dva from 'dva';

describe('dva-odoo', () => {
  it('create base model ok', done => {
    create_base(done);
  });

  it('base model read ok', done => {
    test_read(done);
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

  console.log(model);
  expect(model.namespace).toEqual('testbase');
  expect(model.state).toEqual({ ids: [], id: 0 });

  done();
};

import { call, put, select } from 'redux-saga/effects';

const test_read = done => {
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

  console.log(model);
  expect(model.namespace).toEqual('testbase');
  expect(model.state).toEqual({ ids: [], id: 0 });

  done();
};
