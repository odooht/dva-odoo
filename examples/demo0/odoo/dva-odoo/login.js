/*
  TBD:  after login,
   1 how to save data,
   2 how to send msg to page
   3 call userinfo?
*/

//import dvaOdooServices from './odooServices';

export default odooService => {
  return {
    namespace: 'login',

    state: {
      sid: '',
      uid: 0,
    },

    effects: {
      *login({ payload }, { call, put, select }) {
        const response = yield odooService.login(payload);
        const { result, error: errormsg } = response;
        const data = result;

        if (data.status === 'ok') {
          /* check login result, save login info: sid, uid */
          yield put({ type: 'save', payload: { ...data } });
          const { uid: id } = data;
        } else {
          // ? how to update state?
           console.log('11',response)
        }
      },
    },

    reducers: {
      save(state, { payload }) {
        return { ...state, ...payload };
      },
    },
  };
};
