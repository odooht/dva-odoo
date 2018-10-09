const dvaModel = ({ namespace, model, api }) => {
  return {
    namespace,
    state: {},
    effects: {
      *rename({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.rename(token, payload);
        const { result, error } = response;
        if (result) {
          const { id, name } = payload;
          yield put({
            type: 'odooData/update',
            payload: { model, data: [{ id, name }] },
          });
        }
      },
    },
    reducers: {},
  };
};

const odooApi = options => {
  const {
    model, namespace, fields:{ default: default_fields = ['name'] }, odooCall, api 
  } = options

  
  const searchRead = async (token, params) => {
    const { domain = [] } = params;
    const dm1 = [['type', '=', 'contact']];
    return api.searchRead(token, { ...params, domain: [...domain, ...dm1] });
  };

  const rename = async (token, params) => {
    const { id, name } = params;
    const response = await api.write(token, {
      model,
      id,
      vals: { name },
      context: { mock: 'rename' },
    });
    const { result, error } = response;
    return { result, error };
  };

  const rename2 = async (token, params) => {
    const { id, name } = params;
    const response = await api.write(token, {
      model,
      id,
      vals: { name },
      // context: {mock:'rename'}
    });
    const { result, error } = response;
    return { result, error };
  };

  return {
    rename,
    searchRead,
  };
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
