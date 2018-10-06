import dvaOdoo from '../src/index';
import dvaOdooMock from '../../dva-odoo-mock/src/index';
import dvaOdooGame from '../../dva-odoo-addons-igame/src/index';

import dva from 'dva';
import { call, put, select } from 'redux-saga/effects';

describe('dva-odoo', () => {
  it('login ok', done => {
    test_login(done);
    done();
  });

  it('search ok', done => {
    test_search(done);
    done();
  });

  it('searchRead ok', done => {
    test_search_read(done);
    done();
  });

  it('view ok', done => {
    test_search_read_view(done);
    done();
  });

  it('read ok', done => {
    test_read(done);
    done();
  });

  it('write ok', done => {
    test_search_read_write(done);
    done();
  });

  it('create ok', done => {
    test_search_read_create(done);
    done();
  });
  it('name create ok', done => {
    test_search_read_name_create(done);
    done();
  });

  it('unlink ok', done => {
    test_search_read_unlink(done);
    done();
  });

  it('findOrCreate ok', done => {
    // TBD find or create
    // TBD only find
    test_search_read_findOrCreate(done);
    done();
  });
});

// mock folder
const mockContact = () => {
  return { inherit: 'res.partner' };
};
const mockLogin = () => {
  return {
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
  };
};
const mockIndex = () => {
  const login = mockLogin();
  const contact = mockContact();

  const mockData = {
    contact,
    login,
  };

  const mockService = dvaOdooMock(mockData);
  const proxy = {
    'POST /api/json/api': mockService.call,
    'POST /api/json/user/login': mockService.login,
  };

  // TBD delay()
  return proxy;
};
// mock folder

// service folder
const serviceFile = () => {
  const proxy = mockIndex();
  const service = {
    call: { url: '/api/json/api', proxy },
    login: { url: '/api/json/user/login', db: 'TT' },
  };
  return service;
};
// service folder

const getApp = () => {
  const service = serviceFile();
  const app = dva();

  const model = dvaOdoo(
    dvaOdooGame({
      inherit: 'res.partner.contact',
      //model: 'res.partner',
      namespace: 'contact',
      feilds: ['name'],
      service,
    })
  );

  //  console.log('model:',model);

  expect(model.namespace).toEqual('contact');
  expect(model.state).toEqual({ ids: [], id: 0 });

  const login = dvaOdoo({
    inherit: 'login',
    service,
  });

  //console.log('3,login',login)
  const odooData = dvaOdoo({
    inherit: 'odooData',
  });
  //  console.log('4,odooData',odooData)

  app.model(login);
  app.model(odooData);
  app.model(model);

  app.router(() => 1);
  app.start();
  return app;
};

const test_login = done => {
  const app = getApp();
  const state0 = app._store.getState();
  console.log('1 login,', state0);
  expect(state0.login).toEqual({ sid: '', uid: 0 });
  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      const state2 = app._store.getState();
      console.log('2 login,', state2);
      expect(state2.login).toEqual({
        name: 'ss1',
        sid: 'sid1',
        status: 'ok',
        uid: 1,
      });
    })
    .catch(() => {
      console.log('error');
      done();
    });
};

const test_search = done => {
  const app = getApp();
  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      app._store
        .dispatch({
          type: 'contact/search',
          payload: { domain: [] },
        })
        .then(res => {
          const state3 = app._store.getState();
          console.log('3,search,', state3);
          expect(state3.odooData).toEqual({
            res_partner: {
              1: { id: 1, name: 'n1' },
              2: { id: 2, name: 'n2' },
              3: { id: 3, name: 'n3' },
            },
          });

          expect(state3.contact).toEqual({ ids: [1, 2, 3], id: 0 });
        })
        .catch(res => {
          console.log('error', res);
          done();
        });
    });
};

const test_search_read = done => {
  const app = getApp();

  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      app._store
        .dispatch({
          type: 'contact/searchRead',
          payload: { domain: [] },
        })
        .then(res => {
          const state3 = app._store.getState();
          console.log('search read,', state3);
          expect(state3.odooData).toEqual({
            res_partner: {
              1: { id: 1, name: 'n1' },
              2: { id: 2, name: 'n2' },
              3: { id: 3, name: 'n3' },
            },
          });
          expect(state3.contact).toEqual({ ids: [1, 2, 3], id: 0 });
        })
        .catch(res => {
          console.log('error', res);
          done();
        });
    });
};

const test_search_read_view = done => {
  const app = getApp();

  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      app._store
        .dispatch({
          type: 'contact/searchRead',
          payload: { domain: [] },
        })
        .then(res => {
          const state3 = app._store.getState();
          console.log('search read,', state3);
          expect(state3.odooData).toEqual({
            res_partner: {
              1: { id: 1, name: 'n1' },
              2: { id: 2, name: 'n2' },
              3: { id: 3, name: 'n3' },
            },
          });
          expect(state3.contact).toEqual({ ids: [1, 2, 3], id: 0 });

          const dispatch_View = app._store.dispatch({
            type: 'contact/view',
            payload: { id: 2 },
          });

          console.log('dispatch_View', dispatch_View);
          const state9 = app._store.getState();
          console.log('9 view', state9);
          expect(state9.odooData).toEqual({
            res_partner: {
              1: { id: 1, name: 'n1' },
              2: { id: 2, name: 'n2' },
              3: { id: 3, name: 'n3' },
            },
          });

          expect(state9.contact).toEqual({
            ids: [1, 2, 3],
            id: 2,
          });
        })
        .catch(res => {
          console.log('error', res);
          done();
        });
    });
};

const test_read = done => {
  const app = getApp();

  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      app._store
        .dispatch({
          type: 'contact/read',
          payload: { id: 1 },
        })
        .then(res => {
          const state3 = app._store.getState();
          console.log('read,', state3);
          expect(state3.odooData).toEqual({
            res_partner: {
              1: { id: 1, name: 'n1' },
            },
          });
          expect(state3.contact).toEqual({ ids: [], id: 0 });
        })
        .catch(res => {
          console.log('error', res);
          done();
        });
    });
};

const test_search_read_write = done => {
  const app = getApp();

  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      app._store
        .dispatch({
          type: 'contact/searchRead',
          payload: { domain: [] },
        })
        .then(res => {
          const state3 = app._store.getState();
          console.log('search read,', state3);
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
              console.log('write,', state4);
              console.log('write,', state4.odooData);
              expect(state4.odooData).toEqual({
                res_partner: {
                  1: { id: 1, name: 'n1', email: 'win@odooht' },
                  2: { id: 2, name: 'n2' },
                  3: { id: 3, name: 'n3' },
                },
              });
              expect(state4.contact).toEqual({ ids: [1, 2, 3], id: 0 });
            })
            .catch(res => {
              console.log('error', res);
              done();
            });
        })
        .catch(res => {
          console.log('error', res);
          done();
        });
    });
};

const test_search_read_create = done => {
  const app = getApp();

  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      app._store
        .dispatch({
          type: 'contact/searchRead',
          payload: { domain: [] },
        })
        .then(res => {
          const state3 = app._store.getState();
          console.log('search read,', state3);
          console.log('search read,', state3.odooData);
          expect(state3.odooData).toEqual({
            res_partner: {
              1: { id: 1, name: 'n1', email: 'win@odooht' },
              2: { id: 2, name: 'n2' },
              3: { id: 3, name: 'n3' },
            },
          });
          expect(state3.contact).toEqual({ ids: [1, 2, 3], id: 0 });

          app._store
            .dispatch({
              type: 'contact/create',
              payload: { vals: { name: 'n199' } },
            })
            .then(res => {
              const state5 = app._store.getState();
              console.log('create,', state5);
              expect(state5.odooData).toEqual({
                res_partner: {
                  1: { id: 1, name: 'n1', email: 'win@odooht' },
                  2: { id: 2, name: 'n2' },
                  3: { id: 3, name: 'n3' },
                  4: { id: 4, name: 'n199' },
                },
              });
              expect(state5.contact).toEqual({ ids: [4, 1, 2, 3], id: 4 });
            })
            .catch(res => {
              console.log('error', res);
              done();
            });
        })
        .catch(res => {
          console.log('error', res);
          done();
        });
    });
};

const test_search_read_name_create = done => {
  const app = getApp();

  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      app._store
        .dispatch({
          type: 'contact/searchRead',
          payload: { domain: [] },
        })
        .then(res => {
          const state3 = app._store.getState();
          console.log('search read,', state3);
          console.log('search read,', state3.odooData);
          expect(state3.odooData).toEqual({
            res_partner: {
              1: { id: 1, name: 'n1', email: 'win@odooht' },
              2: { id: 2, name: 'n2' },
              3: { id: 3, name: 'n3' },
              4: { id: 4, name: 'n199' },
            },
          });
          expect(state3.contact).toEqual({ ids: [1, 2, 3, 4], id: 0 });

          app._store
            .dispatch({
              type: 'contact/nameCreate',
              payload: { name: 'n198' },
            })
            .then(res => {
              const state6 = app._store.getState();
              console.log('name create,', state6);
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
                ids: [5, 1, 2, 3, 4],
                id: 5,
              });
            })
            .catch(res => {
              console.log('error', res);
              done();
            });
        })
        .catch(res => {
          console.log('error', res);
          done();
        });
    });
};

const test_search_read_unlink = done => {
  const app = getApp();

  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      app._store
        .dispatch({
          type: 'contact/searchRead',
          payload: { domain: [] },
        })
        .then(res => {
          const state3 = app._store.getState();
          console.log('search read,', state3);
          console.log('search read,', state3.odooData);
          expect(state3.odooData).toEqual({
            res_partner: {
              1: { id: 1, name: 'n1', email: 'win@odooht' },
              2: { id: 2, name: 'n2' },
              3: { id: 3, name: 'n3' },
              4: { id: 4, name: 'n199' },
              5: { id: 5, name: 'n198' },
            },
          });
          expect(state3.contact).toEqual({ ids: [1, 2, 3, 4, 5], id: 0 });

          app._store
            .dispatch({
              type: 'contact/unlink',
              payload: { id: 4 },
            })
            .then(res => {
              const state8 = app._store.getState();
              console.log('8 unlink,', state8);
              expect(state8.odooData).toEqual({
                res_partner: {
                  1: { id: 1, name: 'n1', email: 'win@odooht' },
                  2: { id: 2, name: 'n2' },
                  3: { id: 3, name: 'n3' },
                  5: { id: 5, name: 'n198' },
                },
              });

              expect(state8.contact).toEqual({
                ids: [1, 2, 3, 5],
                id: 0,
              });
            })
            .catch(res => {
              console.log('error', res);
              done();
            });
        })
        .catch(res => {
          console.log('error', res);
          done();
        });
    });
};

const test_search_read_findOrCreate = done => {
  const app = getApp();

  const state0 = app._store.getState();
  console.log('1 login,', state0);
  expect(state0.login).toEqual({ sid: '', uid: 0 });

  app._store
    .dispatch({
      type: 'login/login',
      payload: { login: 'admin', password: '123', type: 'account' },
    })
    .then(res => {
      app._store
        .dispatch({
          type: 'contact/search',
          payload: { domain: [] },
        })
        .then(res => {
          app._store
            .dispatch({
              type: 'contact/findOrCreate',
              payload: { email: 'win@odooht' },
            })
            .then(res => {
              const state7 = app._store.getState();
              console.log('7 find create,', state7);
              expect(state7.odooData).toEqual({
                res_partner: {
                  1: { id: 1, name: 'n1', email: 'win@odooht' },
                  2: { id: 2, name: 'n2' },
                  3: { id: 3, name: 'n3' },
                  5: { id: 5, name: 'n198' },
                  6: { id: 6, email: 'win@odooht' },
                },
              });

              expect(state7.contact).toEqual({
                ids: [6, 1, 2, 3, 5],
                id: 6,
              });
            })
            .catch(res => {
              console.log('error', res);
              done();
            });
        });
    });
};
