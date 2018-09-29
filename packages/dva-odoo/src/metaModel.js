/*
  metaModel creator, contain 5 effect method:
    read, search, create, write, unlink.

  TBD: check and rewrite reducer method.

  many2one
  one2many
  many2many

*/

import modelExtend from 'dva-model-extend';

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
      *call({ payload }, { call, put, select }){
        let data = {};
        const token = yield select(state => state.login.sid);
        if (!token) {
          data = { result: 0, error: { code: 1, msg: 'no login' } };
        }
        else {
          const { method, args, kwargs = {}, mock } = payload;
          const mock_react_api = namespace + '/' + mock;
          const params = {
            method: 'POST',
            body: {
              jsonrpc: 2.0, id: 1, method: 'call',
              params: {
                model, method, args, kwargs: {...kwargs, context:{mock_react_api}}
              }
            }
          }

          const response0 = yield service(token, params);
          const { result, error } = response0;
          data = { result };

          console.log('call=', params, data)
        }

        const { method, callback } = payload;
        const {type = method + '_callback' , params } = callback;
        yield put({ type, payload: { model, params, data }});
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
        const fn = (payload)=>{
          const { id, fields = default_fields, context={} } = payload;
          const {mock = 'read'} = context;
          const args = [id, fields];
          const method = 'read'
          const callback = { params: payload }
          return  { method, args, mock, callback }
        }
        yield put({ type: 'call', payload: fn(payload) })
      },

      *read_callback({ payload }, { call, put, select }) {
        const { model: model2,params, data } = payload;
        const response = ( data ) => {
          const { result } = data;

          console.log(data)

          let res1 = {};
          for (let r of result) {
            res1[r.id] = r;
          }
          return res1
        }
        const result = response( data )
        yield put({ type: 'odooData/update', payload: { model:model2, data: result } });
      },

      *write({ payload }, { call, put, select }) {
        const fn = (payload)=>{
          const { id, vals, context={} } = payload;
          const {mock = 'write'} = context;
          const args = [id, vals];
          const method = 'write'
          const callback  = { params: payload }
          return  { method, args, mock, callback }
        }
        yield put( {type: 'call',  payload: fn( payload)})
      },

      *write_callback({ payload }, { call, put, select }) {
        const { model: model2, params: { id, vals }, data: { result } } = payload;
        if (result) {
          yield put({
            type: 'odooData/update',
            payload: { model:model2, data: { [id]: vals } },
          });
        }
      },

      *_search({ payload }, { call, put, select }) {

        console.log(payload)
        const fn = (payload) => {
          const { domain, context={} } = payload
          const args = [domain]
          const {mock = 'search'} = context;
          const method = 'search'
          const callback = {type:'_search_callback', params: payload }
          return { method, args, mock, callback}
        }
        yield put( { type: 'call', payload: fn( payload) })
      },

      *_search_callback({ payload }, { call, put, select }) {
        const { params:{fields}, data:{result} } = payload;

        if (result) {
          yield put({
            type: 'read',
            payload: { id: result, fields },
          });
          yield put({ type: 'save', payload: { ids: result } });
        }
      },

      *search({ payload }, { call, put, select }) {
        /* to be overridden, to set domain and fields */
        yield put({ type: '_search', payload });
      },

      *nameCreate({ payload }, { call, put, select }) {
        const fn = (payload)=>{
          const { fields = default_fields, name, context={} } = payload;
          const args = [name];
          const method = 'name_create'
          const {mock = 'nameCreate'} = context;
          const callback = { type: 'nameCreate_callback',params: payload }
          return { method, args, mock, callback  }
        }
        yield put( {type: 'call',  payload: fn( payload)})
      },

      *nameCreate_callback({ payload }, { call, put, select }) {
        const { params: { fields }, data: { result } } = payload;
        if (result) {
          yield put({ type: 'read', payload: { id: result[0], fields } });
          yield put({ type: 'insert', payload: { id: result[0] } });
        }
      },

      *create({ payload }, { call, put, select }) {
        const fn = (payload)=>{
          const { fields = default_fields, vals, context={} } = payload;
          const args = [vals];
          const method = 'create'
          const {mock = 'create'} = context;
          const callback = { params: payload }
          return { method, args, mock, callback }
        }
        yield put( {type: 'call',  payload: fn( payload)})
      },

      *create_callback({ payload }, { call, put, select }) {
        const { params: { fields }, data: { result }} = payload;
        if (result) {
          yield put({ type: 'read', payload: { id: result, fields } });
          yield put({ type: 'insert', payload: { id: result } });
        }
      },

      *unlink({ payload }, { call, put, select }) {
        const fn = (payload)=>{
          const { id, context={} } = payload;
          const args = [id];
          const method = 'unlink'
          const {mock = 'unlink'} = context;
          const callback = { params: payload }
          return { method, args, mock, callback }
        }
        yield put( {type: 'call',  payload: fn( payload)})
      },

      *unlink_callback({ payload }, { call, put, select }) {
        const { model: model2, params: { id }, data: { result } } = payload;
        if (result) {
          yield put({ type: 'odooData/remove', payload: { model:model2, id } });
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
