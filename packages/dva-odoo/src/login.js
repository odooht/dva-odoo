/*
  TBD:  after login,
   1 how to save data,
   3 call userinfo?
*/


const loginApi = (odooService) => {
  const login = async (params) => {
    const response = await odooService.login(params)
    const { result, error } = response;
    return result
  }
  
  return {
    login
  }

}

export default odooService => {
  
  const api = loginApi(odooService)
  
  return {
    namespace: 'login',

    state: {
      sid: '',
      uid: 0,
    },

    effects: {
      *login({ payload }, { call, put, select }) {
        const data = yield api.login(payload);

        if (data.status === 'ok') {
          /* check login result, save login info: sid, uid */
          yield put({ type: 'save', payload: { ...data } });
          const { uid: id } = data;
        } else {
          // ? how to update state?
          // console.log('11',response)
        }
      },
    },

    reducers: {
      log(state, { payload }) {
        const { log=[] } = state;
        return { ...state, log: [...log, payload ] };
      },

      save(state, { payload }) {
        return { ...state, ...payload };
      },
    },
  };
};
