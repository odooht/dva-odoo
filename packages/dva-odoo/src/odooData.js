
export default () => {
  
  
  
  return {
    namespace: 'odooData',

    state: {
      //      res_partner: {1:{id:1,name:'n1'}},
      //      og_igame:    {1:{id:1,name:'n1'}},
    },

    effects: {
      *update({ payload }, { call, put, select }) {
        const data = Object.keys(payload).reduce((acc,cur)=>{
          acc[cur] = payload[cur].reduce(function(acc, cur) {
            acc[cur.id] = cur;
            return acc;
          }, {});
          return acc
        },{})
        
        yield put({ type: 'save', payload: data });
      },
    },

    reducers: {
      remove(state, { payload }) {
        const { model, id } = payload;
        const data = { ...state[model] };
        delete data[id];
        return { ...state, [model]: data };
      },

      save(state, { payload }) {
        const new_state = {};
        for (var model in payload) {
          const new_records = {};
          const old_records = state[model] ? state[model] : {};
          const records = payload[model];
          for (var id in records) {
            const rec = records[id];
            const old_rec = old_records[id] ? old_records[id] : {};
            const new_rec = { ...old_rec, ...rec };
            new_records[id] = new_rec;
          }
          new_state[model] = { ...old_records, ...new_records };
        }

        return { ...state, ...new_state };
      },
    },
  };
};
