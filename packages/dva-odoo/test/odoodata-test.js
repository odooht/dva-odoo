import dvaOdoo from '../src/index';

import dva from 'dva';

describe('dva-odoo', () => {
  it('test odooData model ok', done => {
    test_read(done);
    //test_read_write(done);
    //test_read_remove(done);
  });
});

const service = (token, params) => {
  expect(token).toEqual('sid123');
  //console.log( 'service:', params.body.params)

  switch (params.body.params.kwargs.context.mock_react_api) {
    case 'partner/read':
      return { result: [{ id: 1, name: 'n1' }] };
    default:
      return { result: 1 };
  }
};

const getApp = () => {
  const app = dva();
  app.model({
    namespace: 'login',
    state: { sid: 'sid123' },
  });

  app.model(
    dvaOdoo({
      inherit: 'odooData',
      service,
    })
  );

  app.router(() => 1);
  app.start();

  return app;
};

const test_read = done => {
  const app = getApp();
  const state0 = app._store.getState();

  expect(state0.odooData).toEqual({});

  app._store
    .dispatch({
      type: 'odooData/read',
      payload: {
        model: 'res.partner',
        id: 1,
        namespace: 'partner',
        mock: 'read',
      },
    })
    .then(res => {
      const state2 = app._store.getState();
      expect(state2.odooData).toEqual({
        res_partner: { '1': { id: 1, name: 'n1' } },
      });

      done();
    });
};

const test_read_write = done => {
  const app = getApp();
  const state0 = app._store.getState();
  app._store
    .dispatch({
      type: 'odooData/read',
      payload: {
        model: 'res.partner',
        id: 1,
        namespace: 'partner',
        mock: 'read',
      },
    })
    .then(res => {
      const state2 = app._store.getState();
      expect(state2.odooData).toEqual({
        res_partner: { '1': { id: 1, name: 'n1' } },
      });

      app._store
        .dispatch({
          type: 'odooData/write',
          payload: {
            model: 'res.partner',
            id: 1,
            vals: { name: 'nnn111' },
            namespace: 'partner',
            mock: 'write',
          },
        })
        .then(res => {
          const state3 = app._store.getState();
          expect(state3.odooData).toEqual({
            res_partner: { '1': { id: 1, name: 'nnn111' } },
          });
          done();
        });
    });
};

const test_read_remove = done => {
  const app = getApp();
  const state0 = app._store.getState();
  app._store
    .dispatch({
      type: 'odooData/read',
      payload: {
        model: 'res.partner',
        id: 1,
        namespace: 'partner',
        mock: 'read',
      },
    })
    .then(res => {
      const state2 = app._store.getState();
      expect(state2.odooData).toEqual({
        res_partner: { '1': { id: 1, name: 'n1' } },
      });

      app._store.dispatch({
        type: 'odooData/remove',
        payload: {
          model: 'res.partner',
          id: 1,
          namespace: 'partner',
          mock: 'remove',
        },
      });

      const state4 = app._store.getState();
      expect(state4.odooData).toEqual({ res_partner: {} });

      done();
    });
};
