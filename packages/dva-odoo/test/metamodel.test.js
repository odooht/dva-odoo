import dvaOdoo from '../src/index';

//import mock from 'dva-odoo-mock';

import mock from '../../dva-odoo-mock/src/index';

import dva from 'dva';

describe('dva-odoo', () => {
  it('dva-odoo ok', done => {
    test(done);
    done();
  });
});

import { call, put, select } from 'redux-saga/effects';

import odooServices0 from '../src/odooServices';

const odooServices = options00 => {
  const mockData = {
    contact: { inherit: 'res.partner' },
    login: {
      admin: {
        login: 'admin',
        password: '123',
        sid: 'sid1',
        name: 'ss1',
        uid: 1,
      },
      user: {
        login: 'user',
        password: '123',
        sid: 'sid2',
        name: 'ss2',
        uid: 2,
      },
    },
  };

  const options = {
    call: {
      url: '/api/json/api',
      models: mockData,
    },

    login: {
      url: '/api/json/user/login',
      db: 'TT',
      models: mockData,
    },
  };

  return {
    call: (token, params) => {
      const {
        call: { url: url0, models },
      } = options;
      const now = Date.now();

      const url = `${url0}?session_id=${token}&_now=${now}`;

      return mock({
        type: 'call',
        models,
        payload: { url, params },
      });
    },

    login: params => {
      const {
        login: { url, db, models },
      } = options;

      const { body } = params;
      const { params: params2 } = body;
      return mock({
        type: 'login',
        models,
        //mockModel: { inherit:'login'},
        payload: {
          url,
          params: { ...options, body: { ...body, params: { ...params2, db } } },
        },
      });
    },
  };
};

const test = done => {
  const app = dva();

  const model = dvaOdoo({
    model: 'res.partner',
    namespace: 'contact',
    inherit: 'res.partner',
    service: odooServices().call,
  });

  //console.log(model);
  expect(model.namespace).toEqual('contact');
  expect(model.state).toEqual({ ids: [], id: 0 });

  const login = dvaOdoo({
    inherit: 'login',
    service: odooServices().login,
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
  //console.log(state0)
  expect(state0.login).toEqual({ sid: '', uid: 0 });

  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      const state2 = app._store.getState();
      //console.log(state2)
      expect(state2.login).toEqual({
        name: 'ss1',
        sid: 'sid1',
        status: 'ok',
        uid: 1,
      });

      app._store
        .dispatch({
          type: 'contact/search',
          payload: { domain: [] },
        })
        .then(res => {
          const state3 = app._store.getState();
          //      console.log(state3)
          expect(state3.odooData).toEqual({
            res_partner: {
              1: { id: 1, name: 'n1' },
              2: { id: 2, name: 'n2' },
              3: { id: 3, name: 'n3' },
            },
          });

          expect(state3.contact).toEqual({ ids: [1, 2, 3], id: 0 });

          app._store
            .dispatch({
              type: 'contact/write',
              payload: { id: 1, vals: { id: 1, email: 'win@odooht' } },
            })
            .then(res => {
              const state4 = app._store.getState();
              //        console.log(state4)
              expect(state4.odooData).toEqual({
                res_partner: {
                  1: { id: 1, name: 'n1', email: 'win@odooht' },
                  2: { id: 2, name: 'n2' },
                  3: { id: 3, name: 'n3' },
                },
              });
              expect(state4.contact).toEqual({ ids: [1, 2, 3], id: 0 });

              app._store
                .dispatch({
                  type: 'contact/create',
                  payload: { vals: { name: 'n199' } },
                })
                .then(res => {
                  const state5 = app._store.getState();
                  //          console.log(state5)
                  expect(state5.odooData).toEqual({
                    res_partner: {
                      1: { id: 1, name: 'n1', email: 'win@odooht' },
                      2: { id: 2, name: 'n2' },
                      3: { id: 3, name: 'n3' },
                      4: { id: 4, name: 'n199' },
                    },
                  });
                  expect(state5.contact).toEqual({ ids: [4, 1, 2, 3], id: 4 });

                  app._store
                    .dispatch({
                      type: 'contact/nameCreate',
                      payload: { name: 'n198' },
                    })
                    .then(res => {
                      const state6 = app._store.getState();
                      //            console.log(state6)
                      expect(state6.odooData).toEqual({
                        res_partner: {
                          1: { id: 1, name: 'n1', email: 'win@odooht' },
                          2: { id: 2, name: 'n2' },
                          3: { id: 3, name: 'n3' },
                          5: { id: 5, name: 'n198' },
                          4: { id: 4, name: 'n199' },
                        },
                      });
                      expect(state6.contact).toEqual({
                        ids: [5, 4, 1, 2, 3],
                        id: 5,
                      });

                      app._store
                        .dispatch({
                          type: 'contact/findOrCreate',
                          payload: { email: 'win@odooht' },
                        })
                        .then(res => {
                          const state7 = app._store.getState();
                          //              console.log(state7)
                          expect(state7.odooData).toEqual({
                            res_partner: {
                              1: { id: 1, name: 'n1', email: 'win@odooht' },
                              2: { id: 2, name: 'n2' },
                              3: { id: 3, name: 'n3' },
                              4: { id: 4, name: 'n199' },
                              5: { id: 5, name: 'n198' },
                              6: { id: 6, email: 'win@odooht' },
                            },
                          });

                          expect(state7.contact).toEqual({
                            ids: [6, 5, 4, 1, 2, 3],
                            id: 6,
                          });

                          app._store
                            .dispatch({
                              type: 'contact/unlink',
                              payload: { id: 4 },
                            })
                            .then(res => {
                              const state8 = app._store.getState();
                              //                console.log(state8)
                              expect(state8.odooData).toEqual({
                                res_partner: {
                                  1: { id: 1, name: 'n1', email: 'win@odooht' },
                                  2: { id: 2, name: 'n2' },
                                  3: { id: 3, name: 'n3' },
                                  5: { id: 5, name: 'n198' },
                                  6: { id: 6, email: 'win@odooht' },
                                },
                              });

                              expect(state8.contact).toEqual({
                                ids: [6, 5, 1, 2, 3],
                                id: 6,
                              });

                              app._store
                                .dispatch({
                                  type: 'contact/view',
                                  payload: { id: 2 },
                                })
                                .then(res => {
                                  const state9 = app._store.getState();
                                  //                  console.log(state8)
                                  expect(state9.odooData).toEqual({
                                    res_partner: {
                                      1: {
                                        id: 1,
                                        name: 'n1',
                                        email: 'win@odooht',
                                      },
                                      2: { id: 2, name: 'n2' },
                                      3: { id: 3, name: 'n3' },
                                      5: { id: 5, name: 'n198' },
                                      6: { id: 6, email: 'win@odooht' },
                                    },
                                  });

                                  expect(state8.contact).toEqual({
                                    ids: [6, 5, 1, 2, 3],
                                    id: 2,
                                  });

                                  done();
                                })
                                .catch(() => {
                                  done();
                                });
                            })
                            .catch(() => {
                              done();
                            });
                        })
                        .catch(() => {
                          done();
                        });
                    })
                    .catch(() => {
                      done();
                    });
                })
                .catch(() => {
                  done();
                });
            })
            .catch(() => {
              done();
            });
        })
        .catch(() => {
          done();
        });
    })
    .catch(() => {
      done();
    });
};
