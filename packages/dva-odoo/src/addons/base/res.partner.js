import modelExtend from 'dva-model-extend';

const getCallAction = options => {
  const { method, args, kwargs = {}, mock, callback, params } = options;
  return {
    type: 'call',
    payload: {
      params: {
        method,
        args,
        kwargs,
        mock,
      },
      callback: {
        type: callback ? callback : method + '_callback',
        params,
      },
    },
  };
};

export default options => {
  console.log('res.partner:', options);
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
          const {
            fields = default_fields,
            email,
            mock = 'findOrCreate',
          } = payload;
          yield put(
            getCallAction({
              method: 'find_or_create',
              args: [email],
              mock,
              callback: 'findOrCreate_callback',
              params: payload,
            })
          );
        },

        *findOrCreate_callback({ payload }, { call, put, select }) {
          const {
            params: { fields },
            response: { result },
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
