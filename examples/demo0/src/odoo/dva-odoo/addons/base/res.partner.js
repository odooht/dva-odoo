const dvaModel = ({ namespace, model, api }) => {
  return {
    namespace,
    state: {},
    effects: {
      *findOrCreate({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const response = yield api.findOrCreate(token, payload);
        yield put({ type:'response', payload: { method:'create', params:{},response}})
      },
    },
    reducers: {},
  };
};

const odooApi = options => {
  const { model, namespace, odooCall, api, 
    fields:{ default: default_fields = ['name'] } 
  } = options

  const _findOrCreate = async (token, params) => {
    const { email, context = {} } = params;
    const { mock = 'findOrCreate' } = context;
    const mock_react_api = namespace + '/' + mock;
    const method = 'find_or_create';
    const response = await odooCall(token, {
      model, method, args: [email],
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
      const response2 = await api.read(token, { id: result0, fields });
      const { result, error } = response2;
      return { result, error };
    }
    return { result: result0, error: error0 };
  };

  return {
    findOrCreate,
  };
};

const fields = {
    default: [
        'name', 'comment',
        'color',
        'date', 
        'type',
        'child_ids',
        'category_id',
    ],
    
    many2one: {
    },
    
    one2many: {
        child_ids: {
          model: 'res.partner', 
          namespace:'contact',
          fields:{default:['name']},
          domain: [],
        },

        category_id:{
          model:'res.partner.category', 
          namespace:'res.partner.category',
          fields:{default:['name']},
          domain: [],
        }
    },

}

export default child => {
  const { apis =[], extend =[], fields2 =[] } = child;
  
  return {
    ...child,
    model: 'res.partner',
    inherit: 'base',
    fields2: [ fields, ...fields2],
    apis: [odooApi, ...apis],
    extend: [dvaModel, ...extend],
  };
};
