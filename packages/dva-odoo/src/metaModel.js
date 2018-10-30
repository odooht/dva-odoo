/*
  metaModel creator, contain 5 effect method:
    read, search, create, write, unlink.

  TBD: check and rewrite reducer method.
*/

import odooApi from './odooApi';


const dvaModel = ({ model, namespace, fields: out_fields, api }) => {
  
  const {
    default: default_fields = ['name'], 
    many2one = {}, one2many = {}
  } = out_fields
  
  return {
    namespace,
    state: {
      ids: [],
      id: 0,
    },

    effects: {
      *view({ payload }, { call, put, select }) {
        const { id: pid } = payload;
        const { id: oid, ids: oids } = yield select(state => state[namespace]);

        if (oids.indexOf(pid) >= 0) {
          yield put({ type: 'save', payload: { id: pid } });
        }
      },

      *search({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const method = 'search'
        const params = payload
        const response = yield api[method](token, params);
        yield put({ type: 'response',  payload: { method, params,response } })
      },
      
      *read({ payload }, { call, put, select }) {
        const method = 'read'
        const params = payload
        const token = yield select(state => state.login.sid);
        const response = yield api[method](token, params);
        yield put({ type: 'response',  payload: { method, params,response } })
      },

      *write({ payload }, { call, put, select }) {
        const method = 'write'
        const params = payload
        const token = yield select(state => state.login.sid);
        const response = yield api[method](token, params);
        yield put({ type: 'response',  payload: { method, params,response } })
      },

      *nameCreate({ payload }, { call, put, select }) {
        const method = 'nameCreate'
        const params = payload
        const token = yield select(state => state.login.sid);
        const response = yield api[method](token, params);
        yield put({ type: 'response',  payload: { method, params,response } })
      },

      *create({ payload }, { call, put, select }) {
        const method = 'create'
        const params = payload
        const token = yield select(state => state.login.sid);
        const response = yield api[method](token, params);
        yield put({ type: 'response',  payload: { method, params,response } })
      },

      *unlink({ payload }, { call, put, select }) {
        const method = 'unlink'
        const params = payload
        const token = yield select(state => state.login.sid);
        const response = yield api[method](token, params);
        yield put({ type: 'response',  payload: { method, params,response } })
      },

      *response({ payload }, { call, put, select }){
        const { method, params, response } = payload
        yield put({ type: method + '_response', payload })
        yield put({ type: 'login/log', payload })
        
      },
      
      *search_response({ payload}, { call, put, select }){
        const { params,response } = payload
        const { result, error } = response;
        if (result) {
          yield put({ type: 'odooData/update', payload: result });
          const ids = result[model].map(item => item.id);
          yield put({ type: 'save', payload: { ids } });
        }        
      },
      
      *read_response({ payload}, { call, put, select }){
        const { params,response } = payload
        const { result, error } = response;

        if (result) {
          yield put({ type: 'odooData/update', payload: result });
          // ??? TBD how to update ids and id
        }
      },

      *write_response({ payload}, { call, put, select }){
        const { params,response } = payload
        const { result, error } = response;
        if (result) {
          const { id, vals } = params;
          yield put({
            type: 'odooData/update',
            payload: { [model]: [{ ...vals, id }] },
          });
        }
      },

      *nameCreate_response({ payload}, { call, put, select }){
        const { params,response } = payload
        const { result, error } = response;
        if (result) {
          yield put({
            type: 'odooData/update',
            payload: result,
          });
          yield put({ type: 'insert', payload: { id: result[model][0].id } });
        }
      },

      *create_response({ payload}, { call, put, select }){
        const { params,response } = payload
        const { result, error } = response;

        if (result) {
          yield put({
            type: 'odooData/update',
            payload: result,
          });
          yield put({ type: 'insert', payload: { id: result[model][0].id } });
        }
      },

      *unlink_response({ payload}, { call, put, select }){
        const { params,response } = payload
        const { result, error } = response;
        if (result) {
          const { id } = params;
          yield put({
            type: 'odooData/remove',
            payload: { model, id },
          });
          yield put({ type: 'remove', payload: { id } });
        }
      },
    },

    reducers: {
    
      insert(state, { payload }) {
        const { ids } = state;
        const { id } = payload;
        const nids = ids.indexOf(id) >= 0 ? ids : [id, ...ids];
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
