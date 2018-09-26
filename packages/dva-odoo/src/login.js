/*
  TBD:  after login,
   1 how to save data,
   2 how to send msg to page
   3 call userinfo?
*/

const jsonrpc = params => {
  return {
    method: 'POST',
    body: {
      jsonrpc: 2.0,
      id: 1,
      method: 'call',
      params: params,
    },
  };
};

export default options => {
  const { service } = options;

  return {
    namespace: 'login',

    state: {
      sid: '',
      uid: 0,
    },

    effects: {
      *login({ payload, callback, success, error }, { call, put, select }) {
        const response = yield service(jsonrpc(payload));
        const { result, error: errormsg } = response;
        // response.error,  error code is always 200, send by odoo.
        // error msg is odoo exception
        const data = result;

        if (data.status === 'ok') {
          /* check login result, save login info: sid, uid */
          yield put({ type: 'save', payload: { ...data } });
          const { uid: id } = data;
          const payload2 = {
            model: 'res.users',
            id,
            fields: ['name'],
            namespace: 'user',
            mock: 'read',
          };
          yield put({ type: 'odooData/read', payload: payload2 });
          yield put({ type: 'login_success', payload: data });
          if (callback) {
            callback(data);
          }
          if (success) {
            success(data);
          }
        } else {
          // ? how to update state?
          yield put({ type: 'login_error', payload: data });
          if (callback) {
            callback(data);
          }
          if (error) {
            error(data);
          }
        }
      },

      *login_success({ payload }, { call, put, select }) {
        /*  to overwrite this method  */
      },

      *login_error({ payload }, { call, put, select }) {
        /*  to overwrite this method  */
      },
    },

    reducers: {
      save(state, { payload }) {
        return { ...state, ...payload };
      },
    },
  };
};
