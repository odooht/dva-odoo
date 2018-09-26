import dvaOdoo from '../src/index';

import dva from 'dva';

describe('dva-odoo', () => {
  it(' ok', done => {
    done();
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
