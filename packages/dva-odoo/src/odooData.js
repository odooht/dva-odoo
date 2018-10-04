/*
*/

function dot2line(model) {
  return model.replace('.', '_');
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
        const { model, data } = payload;
        yield put({
          type: 'save',
          payload: { [dot2line(model)]: list2dict(data) },
        });
      },
    },

    reducers: {
      remove(state, { payload }) {
        const { model, id } = payload;
        const model2 = dot2line(model);
        const data = { ...state[model2] };
        delete data[id];
        return { ...state, [model2]: data };
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
