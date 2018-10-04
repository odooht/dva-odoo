export default options => {
  const model = 'res.partner';

  //  console.log('partner,',options)

  const createself = options => {
    const {
      model,
      namespace,
      api,
      odooCall,

      fields: default_fields = ['name'],
    } = options;

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
      namespace: namespace,

      state: {},

      effects: {
        *findOrCreate({ payload }, { call, put, select }) {
          const token = yield select(state => state.login.sid);
          const response = yield api2.findOrCreate(token, {
            model,
            namespace,
            ...payload,
          });
          const { result, error } = response;

          if (result) {
            const { fields = default_fields } = payload;
            const response2 = yield api.read(token, {
              id: result,
              fields,
              model,
              namespace,
            });

            const { result: result2, error: error2 } = response2;
            if (result2) {
              yield put({
                type: 'odooData/update',
                payload: { model, data: result2 },
              });

              yield put({ type: 'insert', payload: { id: result } });
            }
          }
        },
      },

      reducers: {},
    };
  };

  const { extend = [] } = options;

  return {
    ...options,
    model,
    inherit: 'base',
    extend: [createself, ...extend],
  };
};
