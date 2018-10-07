const dvaModel = ({ namespace, model, api }) => {
  return {
    namespace,
    state: {},
    effects: {
      *findOrCreate({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.findOrCreate(token, payload);
        const { result, error } = response;
        if (result) {
          yield put({
            type: 'odooData/update',
            payload: { model, data: result },
          });
          yield put({ type: 'insert', payload: { id: result[0].id } });
        }
      },
    },
    reducers: {},
  };
};

const odooApi = options => {
  const { model, namespace, fields: default_fields = ['name'], odooCall, api } = options;

  const _findOrCreate = async (token, params) => {
    const { email, context = {} } = params;
    const { mock = 'findOrCreate' } = context;
    const mock_react_api = namespace + '/' + mock;
    const method = 'find_or_create';
    const response = await odooCall(token, {
      model,
      method,
      args: [email],
      kwargs: { context: { ...context, mock_react_api } },
    });

    const { result, error } = response;
    return { result, error };
  };

  const findOrCreate = async (token, params) => {
    const response = await _findOrCreate(token, params);
    const { result: result0, error: error0 } = response;

    if (result0) {
      const { fields = default_fields } = params;
      const response2 = await api.read(token, {
        id: result0,
        fields,
      });
      const { result, error } = response2;
      return { result, error };
    }
    return { result: result0, error: error0 };
  };

  return {
    findOrCreate,
  };
};

export default child => {
  const { apis = [], extend = [] } = child;

  return {
    ...child,
    model: 'res.partner',
    inherit: 'base',
    apis: [odooApi, ...apis],
    extend: [dvaModel, ...extend],
  };
};
