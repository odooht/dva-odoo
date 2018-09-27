import { odooLogin, odooCall } from '../src/odooApi';

describe('dva-odoo', () => {
  it('test odoo login ok', done => {
    test_login(done);
  });
  it('test odoo call  ok', done => {
    test_call(done);
  });
});

const test_login = done => {
  const params = { login: 'admin', password: '123' };
  const ret_value = { sid: 'sid1' };

  const service = params_in => {
    expect(params_in).toEqual({
      method: 'POST',
      body: {
        jsonrpc: 2.0,
        id: 1,
        method: 'call',
        params: params,
      },
    });

    return { result: ret_value };
  };

  const result = odooLogin({ service, params });
  result.then(res => {
    expect(res).toEqual(ret_value);
    done();
  });
};

const test_call = done => {
  const token = '1';
  const params = {
    model: 'res.partner',
    method: 'search',
    args: [[]],
    kwargs: {},
    namespace: 'ptn',
    mock: 'search',
  };

  const service = (token_in, params_in) => {
    expect(token_in).toEqual(token);
    expect(params_in.body.params).toEqual({
      model: 'res.partner',
      method: 'search',
      args: [[]],
      kwargs: { context: { mock_react_api: 'ptn/search' } },
    });
    return { result: ret_value };
  };

  const ret_value = { id: 1 };

  const payload = { service, token, params };

  const result = odooCall(payload);
  result.then(res => {
    expect(res).toEqual(ret_value);
    done();
  });
};
