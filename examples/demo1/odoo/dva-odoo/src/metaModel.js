/*
  metaModel creator, contain 5 effect method:
    read, search, create, write, unlink.

  TBD: check and rewrite reducer method.

  many2one
  one2many
  many2many

*/

import odooApi from './odooApi';

const dvaModel = ({
  model,
  namespace,
  api,
  //  fields: default_fields = ['name'],
}) => {
  return {
    namespace,
    state: {
      ids: [],
      id: 0,
    },

    effects: {
      *search({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.searchRead(token, {
          model,
          namespace,
          ...payload,
        });

        const { result, error } = response;

        if (result) {
          yield put({
            type: 'odooData/update',
            payload: { model, data: result },
          });
          const ids = result.map(item => item.id);
          yield put({ type: 'save', payload: { ids } });
        }
      },

      *searchRead({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.searchRead(token, {
          model,
          namespace,
          ...payload,
        });

        const { result, error } = response;
        if (result) {
          yield put({
            type: 'odooData/update',
            payload: { model, data: result },
          });
          const ids = result.map(item => item.id);
          yield put({ type: 'save', payload: { ids } });
        }
      },

      *read({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.read(token, {
          model,
          namespace,
          ...payload,
        });
        const { result, error } = response;

        if (result) {
          yield put({
            type: 'odooData/update',
            payload: { model, data: result },
          });

          // ??? TBD how to update ids and id
        }
      },

      *write({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.write(token, {
          model,
          namespace,
          ...payload,
        });

        const { result, error } = response;

        if (result) {
          const { id, vals } = payload;
          yield put({
            type: 'odooData/update',
            payload: { model, data: [{ ...vals, id }] },
          });
        }
      },

      *nameCreate({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.nameCreateRead(token, {
          model,
          namespace,
          ...payload,
        });

        const { result, error } = response;
        if (result) {
          yield put({
            type: 'odooData/update',
            payload: { model, data: result },
          });
          yield put({ type: 'insert', payload: { id: result[0].id } });
        }
      },

      *create({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.createRead(token, {
          ...payload,
          model,
          namespace,
        });

        const { result, error } = response;

        if (result) {
          yield put({
            type: 'odooData/update',
            payload: { model, data: result },
          });
          yield put({ type: 'insert', payload: { id: result[0].id } });
        }
      },

      *unlink({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.unlink(token, {
          model,
          namespace,
          ...payload,
        });

        const { result, error } = response;
        if (result) {
          const { id } = payload;
          yield put({
            type: 'odooData/remove',
            payload: { model, id },
          });
          yield put({ type: 'remove', payload: { id } });
        }
      },

      *view({ payload }, { call, put, select }) {
        const { id: pid } = payload;
        const { id: oid, ids: oids } = yield select(state => state[namespace]);

        if (oids.indexOf(pid) >= 0) {
          yield put({ type: 'save', payload: { id: pid } });
        }
      },
    },

    reducers: {
      insert(state, { payload }) {
        const { ids } = state;
        const { id } = payload;
        const nids = id in ids ? ids : [id, ...ids];
        return { ...state, ids: nids, id };
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
};

export default child => {
  const { apis = [], extend = [] } = child;
  return {
    ...child,
    apis: [odooApi, ...apis],
    extend: [dvaModel, ...extend],
  };
};
