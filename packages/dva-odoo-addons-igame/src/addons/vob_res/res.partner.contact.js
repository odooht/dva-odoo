const dvaModel = ({
  namespace,
  model,
  api,
  fields: default_fields = ['name'],
}) => {
  return {
    namespace,
    state: {},
    effects: {
      *rename({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.rename(token, {
          model,
          namespace,
          ...payload,
        });
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

const odooApi = ({ model, namespace, odooCall, api }) => {
  return {
    searchRead: async (token, params) => {
      const { domain = [] } = params;
      const dm1 = [['type', '=', 'contact']];
      return api.searchRead(token, { ...params, domain: [...domain, ...dm1] });
    },

    rename: async (token, params) => {
      const { id, name, context = {} } = params;
      const { mock = 'rename' } = context;
      const mock_react_api = namespace + '/' + mock;
      const response = await api.write(token, {
        model,
        id,
        name,
        kwargs: { context: { ...context, mock_react_api } },
      });

      const { result, error } = response;
      return { result, error };
    },
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
