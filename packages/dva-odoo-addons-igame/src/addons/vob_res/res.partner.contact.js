
export default (options) => {
  const { namespace, extend=[], fields: default_fields=['name'] } = options;

  const parent = ({namespace}) => {
    return {
      namespace: namespace,
      state: {
      },
      effects: {
        *rename({ payload }, { call, put, select }) {
          const fn = (payload) => {
            const { id, name, mock= 'rename'} = payload;
            const method = 'write';
            const args = [id, { name }];
            const callback = 'rename_callback';
            return { method, args, mock, callback, params:payload} ;
          }
          yield put({type: 'call', payload: fn(payload) })
        },

        *rename_callback({ payload  }, { call, put, select }){
          const {params: { id, name }, data: result } = payload;
          if(result){
            yield put({ type: 'read', payload: {id, fields:default_fields } })
          }
        },

        *search({ payload }, { call, put, select }) {
          const { domain=[], fields, mock='search' } = payload;
          const dm1 = [['type','=','contact']]
          yield put({ type: '_search',
                      payload: { domain:[...domain, ...dm1 ], fields, mock } });

        },

      },

      reducers: {
      },

    }
  }

  return {
     ...options,
     inherit:'res.partner',
     extend: [parent,...extend]
  }

}
