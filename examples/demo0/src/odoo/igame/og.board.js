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
        const params = {id, vals}
        yield put({ type: 'response', payload: { method:'write', params,response } })
      },

      *bid({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.bid(token, {model, namespace, payload });
        const { result, error } = response;
        const msg = result ? 'bid error' : 'bid ok'
        yield put({ type: 'save', payload: { msg} });
      },

      *play({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.play(token, {model, namespace, payload });
        const { result, error } = response;
        const msg = result ? 'play error' : 'play ok'
        yield put({ type: 'save', payload: { msg} });
      },

      *claim({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.claim(token, {model, namespace, payload });
        const { result, error } = response;
        const msg = result ? 'claim error' : 'claim ok'
        yield put({ type: 'save', payload: { msg} });
      },

      *claimAck({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.claimAck(token, {model, namespace, payload });
        const { result, error } = response;
        const msg = result ? 'claimAck error' : 'claimAck ok'
        yield put({ type: 'save', payload: { msg} });
      },

      *undo({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.undo(token, {model, namespace, payload });
        const { result, error } = response;
        const msg = result ? 'undo error' : 'undo ok'
        yield put({ type: 'save', payload: { msg} });
      },


    },
    reducers: {},
  };
};

const odooApi = options => {
  const { model, namespace, odooCall, api } = options

  const bid = async (token, params) => {
    const { id, pos, call, context = {} } = params;
    const { mock = 'bid' } = context;
    const mock_react_api = namespace + '/' + mock;
    const method = 'bid';
    const response = await odooCall(token, {
      model, method, args: [id, pos, call],
      kwargs: { context: { ...context, mock_react_api } },
    });

    const { result, error } = response;
    return { result, error };
  };

  const play = async (token, params) => {
    const { id, pos, card, context = {} } = params;
    const { mock = 'play' } = context;
    const mock_react_api = namespace + '/' + mock;
    const method = 'play';
    const response = await odooCall(token, {
      model, method, args: [id, pos, card],
      kwargs: { context: { ...context, mock_react_api } },
    });

    const { result, error } = response;
    return { result, error };
  };

  const claim = async (token, params) => {
    const { id, pos, num, context = {} } = params;
    const { mock = 'claim' } = context;
    const mock_react_api = namespace + '/' + mock;
    const method = 'claim';
    const response = await odooCall(token, {
      model, method, args: [id, pos, num],
      kwargs: { context: { ...context, mock_react_api } },
    });
    const { result, error } = response;
    return { result, error };
  };

  const claimAck = async (token, params) => {
    const { id, pos, ack, context = {} } = params;
    const { mock = 'claimAck' } = context;
    const mock_react_api = namespace + '/' + mock;
    const method = 'claim_ack';
    const response = await odooCall(token, {
      model, method, args: [id, pos, ack],
      kwargs: { context: { ...context, mock_react_api } },
    });
    const { result, error } = response;
    return { result, error };
  };

  const undo = async (token, params) => {
    const { id, pos, num, context = {} } = params;
    const { mock = 'undo' } = context;
    const mock_react_api = namespace + '/' + mock;
    const method = 'undo';
    const response = await odooCall(token, {
      model, method, args: [id, pos, num],
      kwargs: { context: { ...context, mock_react_api } },
    });
    const { result, error } = response;
    return { result, error };
  };

  return {
    bid,
    play,
    claim,
    claimAck,
    undo,
  };
};

const fields = {
    default: [
        'name', 
    ],
  }

export default child => {
  const { apis = [], extend = [], fields2 =[]  } = child;
  return {
    ...child,
    model: 'og.board',
    inherit: 'base',
    fields2: [ fields, ...fields2],
    apis: [odooApi, ...apis],
    extend: [dvaModel, ...extend],
  };
};
