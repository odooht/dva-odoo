

const new_model = (model) => {

  const namespace0 = model.split('.').map(
    item => item.substring(0,1).toUpperCase() + item.substring(1)
  ).join('')

  const namespace = namespace0.substring(0,1).toLowerCase(
      ) + namespace0.substring(1)

  return namespace

}


const list2dict = result => {
  if (result) {
    let res1 = {};
    for (let r of result) {
      res1[r.id] = r;
    }
    return res1;
  } else {
    return result;
  }
};

export default () => {
  return {
    namespace: 'odooData',

    state: {
      //      res_partner: {1:{id:1,name:'n1'}},
      //      og_igame:    {1:{id:1,name:'n1'}},
    },

    effects: {
      *update({ payload }, { call, put, select }) {
        let data = {}
        for(const model in payload){
          data[new_model(model)] = list2dict( payload[model])
        }

        yield put({
          type: 'save',
          payload: data,
        });
      },
    },

    reducers: {
      remove(state, { payload }) {
        const { model, id } = payload;
        const model2= new_model(model)

        const data = { ...state[model2] };
        delete data[id];
        return { ...state, [model2]: data };
      },

      save(state, { payload }) {
        const model2= new_model(model)

        const new_state = {};
        for (var model in payload) {
          const new_records = {};
          const old_records = state[model2] ? state[model2] : {};
          const records = payload[model];
          for (var id in records) {
            const rec = records[id];
            const old_rec = old_records[id] ? old_records[id] : {};
            const new_rec = { ...old_rec, ...rec };
            new_records[id] = new_rec;
          }
          new_state[model2] = { ...old_records, ...new_records };
        }

        return { ...state, ...new_state };
      },
    },
  };
};
