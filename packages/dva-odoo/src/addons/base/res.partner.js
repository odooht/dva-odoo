export default options => {
  const model = 'res.partner';

  const createself = options => {
    const {
      model,
      namespace,
      service,
      fields: default_fields = ['name'],
    } = options;
    return {
      namespace: namespace,

      state: {},

      effects: {
        *findOrCreate({ payload }, { call, put, select }) {
          const fn = payload => {
            const { fields = default_fields, email, context = {} } = payload;
            const { mock = 'findOrCreate' } = context;
            const method = 'find_or_create';
            const args = [email];
            const callback = { type: 'findOrCreate_callback', params: payload };

            return { method, args, mock, callback };
          };
          yield put({ type: 'call', payload: fn(payload) });
        },

        *findOrCreate_callback({ payload }, { call, put, select }) {
          const {
            params: { fields },
            data: { result },
          } = payload;

          if (result) {
            yield put({ type: 'read', payload: { id: result, fields } });
            yield put({ type: 'insert', payload: { id: result } });
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
