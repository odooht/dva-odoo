/*
  metaModel creator, contain 5 effect method:
    read, search, create, write, unlink.

  TBD: check and rewrite reducer method.
*/

import modelExtend from 'dva-model-extend';

function _odooCallParams(params0) {
  const {
    model,
    method,
    args = [],
    kwargs = {},
    namespace = '',
    mock = '',
  } = params0;
  const { context = {} } = kwargs;
  const mock_react_api = namespace + '/' + mock;

  const kw2 = mock
    ? { ...kwargs, context: { ...context, mock_react_api } }
    : kwargs;
  const params = { model, method, args, kwargs: kw2 };
  return params;
}

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

const getCallAction = options => {
  const { method, args, kwargs = {}, mock, callback, params } = options;
  return {
    type: 'call',
    payload: {
      params: {
        method,
        args,
        kwargs,
        mock,
      },
      callback: {
        type: callback ? callback : method + '_callback',
        params,
      },
    },
  };
};

export default options => {
  const {
    model,
    namespace,
    service,
    fields: default_fields = ['name'],
  } = options;

  const baseModel = {
    namespace: namespace,

    state: {
      ids: [],
      id: 0,
    },

    effects: {
      *call({ payload }, { call, put, select }) {
        const { callback } = payload;
        let response = {};

        const token = yield select(state => state.login.sid);
        if (!token) {
          response = { result: 0, error: { code: 1, msg: 'no login' } };
        } else {
          const { params: params0 } = payload;
          const params1 = { ...params0, model, namespace };
          const params = jsonrpc(_odooCallParams(params1));
          const response0 = yield service(token, params);
          const { result, error } = response0;
          response = { result };
        }

        yield put({
          type: callback.type,
          payload: {
            params: callback.params,
            response,
          },
        });
      },
    },

    reducers: {
      view(state, { payload }) {
        const { id: pid } = payload;
        const { id: oid, ids: oids } = state;

        const id = pid && pid in oids ? pid : oid;
        return { ...state, id };
      },

      insert(state, { payload }) {
        const { ids } = state;
        const { id } = payload;
        return { ...state, ids: [id, ...ids], id };
      },

      remove(state, { payload }) {
        const { ids: oids, id: oid } = state;
        const { id: pid } = payload;
        const ids = oids.filter(i => i != pid);
        const id = oid != pid ? oid : 0;
        return { ...state, ids, id };
      },

      save(state, { payload }) {
        return { ...state, ...payload };
      },
    },
  };

  const extendModel = {
    effects: {
      *read({ payload }, { call, put, select }) {
        const { id, fields = default_fields, mock = 'read' } = payload;
        yield put(
          getCallAction({
            method: 'read',
            args: [id, fields],
            mock,
            params: payload,
          })
        );
      },

      *read_callback({ payload }, { call, put, select }) {
        const {
          response: { result },
        } = payload;

        let res1 = {};
        for (let r of result) {
          res1[r.id] = r;
        }

        yield put({ type: 'odooData/update', payload: { model, data: res1 } });
      },

      *write({ payload }, { call, put, select }) {
        const { id, vals, mock = 'write' } = payload;
        yield put(
          getCallAction({
            method: 'write',
            args: [id, vals],
            mock,
            params: payload,
          })
        );
      },

      *write_callback({ payload }, { call, put, select }) {
        const {
          params: { id, vals },
          response: { result },
        } = payload;
        if (result) {
          yield put({
            type: 'odooData/update',
            payload: { model, data: { [id]: vals } },
          });
        }
      },

      *_search({ payload }, { call, put, select }) {
        const { domain, mock = 'search' } = payload;

        yield put(
          getCallAction({
            method: 'search',
            args: [domain],
            mock,
            callback: '_search_callback',
            params: payload,
          })
        );
      },

      *_search_callback({ payload }, { call, put, select }) {
        const {
          params: { fields },
          response: { result },
        } = payload;
        if (result) {
          yield put({
            type: 'read',
            payload: { id: result, fields, mock: 'multiRead' },
          });
          yield put({ type: 'save', payload: { ids: result } });
        }
      },

      *search({ payload }, { call, put, select }) {
        /* to be overridden, to set domain and fields */
        yield put({ type: '_search', payload });
      },

      *nameCreate({ payload }, { call, put, select }) {
        const { fields = default_fields, name, mock = 'nameCreate' } = payload;
        yield put(
          getCallAction({
            method: 'name_create',
            args: [name],
            mock,
            callback: 'nameCreate_callback',
            params: payload,
          })
        );
      },

      *nameCreate_callback({ payload }, { call, put, select }) {
        const {
          params: { fields },
          response: { result },
        } = payload;
        if (result) {
          yield put({ type: 'read', payload: { id: result[0], fields } });
          yield put({ type: 'insert', payload: { id: result[0] } });
        }
      },

      *create({ payload }, { call, put, select }) {
        const { fields = default_fields, vals, mock = 'create' } = payload;
        yield put(
          getCallAction({
            method: 'create',
            args: [vals],
            mock,
            params: payload,
          })
        );
      },

      *create_callback({ payload }, { call, put, select }) {
        const {
          params: { fields },
          response: { result },
        } = payload;
        if (result) {
          yield put({ type: 'read', payload: { id: result, fields } });
          yield put({ type: 'insert', payload: { id: result } });
        }
      },

      *unlink({ payload }, { call, put, select }) {
        const { id, mock = 'unlink' } = payload;
        yield put(
          getCallAction({
            method: 'unlink',
            args: [id],
            mock,
            params: payload,
          })
        );
      },

      *unlink_callback({ payload }, { call, put, select }) {
        const {
          params: { id },
          response: { result },
        } = payload;
        if (result) {
          yield put({ type: 'odooData/remove', payload: { model, id } });
          yield put({ type: 'remove', payload: { id } });
        }
      },
    },
  };

  return modelExtend(baseModel, {
    ...extendModel,
    namespace: baseModel.namespace,
  });
};
