import dvaOdoo from '../src/index';

import dva from 'dva';

describe('dva-odoo', () => {
  it('create odooData model ok', done => {
    create_odoodata(done);
  });
});

const create_odoodata = done => {
  const app = dva();

  const model = dvaOdoo({
    inherit: 'odooData',
    service: () => {
      {
        id: 1;
      }
    },
  });

  console.log(model);

  expect(model.namespace).toEqual('odooData');
  expect(model.state).toEqual({});

  app.model(model);
  app.router(() => 1);
  app.start();

  const oldState = app._store.getState().odooData;
  expect(oldState).toEqual({});
  done();
};
