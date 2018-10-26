import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

const dvaModel = ({ namespace, model, api }) => {
  return {
    namespace,
    state: {},
    effects: {
      *writeResult({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const { id, declarer, contract, openlead,result } = payload;
        const vals = {
          declarer, contract, openlead,result,
          state:'done'
        };
        const response = yield api.write(token, {model, namespace, id, vals, });
        const { result:result2, error } = response;

        if (result2) {
          yield put({
            type: 'odooData/update',
            payload: { [model]: [{ ...vals, id }] },
          });
        }
      },
    },
    reducers: {},
  };
};

export default dvaOdoo({
  model: 'og.board',
  namespace: 'board',
  inherit: 'og.board',
  service,
  dvaModel,
  fields:{ default: [
    'name','deal_id',
    'number','vulnerable','dealer','hands',
    'declarer', 'contract', 'openlead','result','ns_point','ew_point',
    'auction', 'tricks', 'last_trick', 'current_trick',
    'ns_win','ew_win', 'player', 'state'
  ]}
});
