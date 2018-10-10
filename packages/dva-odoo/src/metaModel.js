/*
  metaModel creator, contain 5 effect method:
    read, search, create, write, unlink.

  TBD: check and rewrite reducer method.

  many2one
  one2many
  many2many

*/

import odooApi from './odooApi';


const dvaModel = ({ model, namespace, fields: out_fields, odooCall, api }) => {
  
  const {
    default: default_fields = ['name'], 
    many2one = {}, one2many = {}
  } = out_fields
  
//  console.log(many2one, one2many)


  const ref_read = async (token, params, data) => {
    const {fields=default_fields} = params
    
    let ref_res = []
    
    for (const fld of fields){
      const ref_read = api.reference[fld]
      
      const one2many_ids = (data) => {
        const ids0 = data.map( item=> item[fld] ? item[fld] : [])
        const ids1 = [].concat.apply([], ids0 )
        return Array.from(new Set(ids1))
      }
      
      const many2one_ids = (data) => {
        const ids0 = data.map( item=> item[fld] ? item[fld][0] : null)
        const ids1 = ids0.filter( item => item != null)
        return Array.from(new Set(ids1))
      }
      
      const ref_model = ( fld in one2many ) ? one2many[fld].model
                      : ( fld in many2one ) ? many2one[fld].model
                      : null
      
      const ref_ids = ( fld in one2many ) ? one2many_ids(data)
                    : ( fld in many2one ) ? many2one_ids(data)
                    : []
      
//      console.log(ref_ids )
      
      if(ref_ids.length){
        const rrr = await ref_read( token ,{ id:ref_ids })
        const {result} = rrr
        if(result){
            ref_res.push({model:ref_model, data:result} )
        }
      }
    }
    
//    console.log( ref_res  )
    
    return ref_res
    
  }

  
  return {
    namespace,
    state: {
      ids: [],
      id: 0,
    },

    effects: {
      *search({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.search(token, payload);
        const { result, error } = response;

        if (result) {
          const ref_res = yield ref_read(token, payload, result)
          for(const item of ref_res){
            yield put({ type: 'odooData/update', payload: item});
          }
          
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
        const response = yield api.read(token, payload);
        const { result, error } = response;

        if (result) {
          const ref_res = yield ref_read(token, payload, result)
          for(const item of ref_res){
            yield put({ type: 'odooData/update', payload: item});
          }
          
          yield put({
            type: 'odooData/update',
            payload: { model, data: result },
          });

          // ??? TBD how to update ids and id
        }
      },

      *write({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.write(token, payload);
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
        const response = yield api.nameCreate(token, payload);

        const { result, error } = response;
        if (result) {
          const ref_res = yield ref_read(token, payload, result)
          for(const item of ref_res){
            yield put({ type: 'odooData/update', payload: item});
          }
          
          yield put({
            type: 'odooData/update',
            payload: { model, data: result },
          });
          yield put({ type: 'insert', payload: { id: result[0].id } });
        }
      },

      *create({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.create(token, payload);
        const { result, error } = response;

        if (result) {
          const ref_res = yield ref_read(token, payload, result)
          for(const item of ref_res){
            yield put({ type: 'odooData/update', payload: item});
          }
          
          yield put({
            type: 'odooData/update',
            payload: { model, data: result },
          });
          yield put({ type: 'insert', payload: { id: result[0].id } });
        }
      },


      *unlink({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        
        const response = yield api.unlink(token, payload);
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
