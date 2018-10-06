const dvaModel = ({ namespace, model, api }) => {
  return {
    namespace,
    state: {},
    effects: {
      *findOrCreate({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.findOrCreateRead(token, {
          model,
          namespace,
          ...payload,
        });
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

const odooApi = ({
  model,
  namespace,
  fields: default_fields = ['name'],
  odooCall,
  api,
}) => {
  const api2 = {
    findOrCreate: async (token, params) => {
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
    },
  };

  return {
    ...api2,
    findOrCreateRead: async (token, params) => {
      const { fields = default_fields } = params;
      const response = await api2.findOrCreate(token, params);
      const { result: result0, error: error0 } = response;

      if (result0) {
        const response2 = await api.read(token, {
          model,
          id: result0,
          fields,
          namespace,
        });
        const { result, error } = response2;
        return { result, error };
      }
      return { result: result0, error: error0 };
    },
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
