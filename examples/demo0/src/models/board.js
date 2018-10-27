
import dvaOdoo from '@/odoo/dvaOdoo';

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

export default dvaOdoo({ model: 'og.board',dvaModel })

