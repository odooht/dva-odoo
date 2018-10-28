const dvaModel = ({ namespace, model, api }) => {
  return {
    namespace,
    state: {},
    effects: {
      *rename({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.rename(token, payload);
        const { id, name } = payload;
        const params = {id, vals:{name}}
        yield put({ type: 'response', payload: { method:'write', params,response } })
      },
    },
    reducers: {},
  };
};

const odooApi = options => {
  const {model, namespace, api, fields:{default: default_fields = ['name'] }} = options
  const search = async (token, params) => {
    const { domain = [] } = params;
    const dm1 = [['type', '=', 'contact']];
    return api.search(token, { ...params, domain: [...domain, ...dm1] });
  };

  const rename = async (token, params) => {
    const { id, name } = params;
    const response = await api.write(token, {
      model, id, vals: { name }, 
      context: { mock: 'rename' },
    });
    const { result, error } = response;
    return { result, error };
  };

  return { rename, search };
};

export default child => {
  const { apis = [], extend = [] } = child;
  return {
    ...child,
    inherit: 'res.partner',
    apis: [odooApi, ...apis],
    extend: [dvaModel, ...extend],
  };
};
