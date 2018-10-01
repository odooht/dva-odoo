export default mockdata => {
  return {
    login: ({ password, login, type }) => {
      const loginUsers = mockdata;
      const user = loginUsers[login];
      if (user) {
        const { password: psw, sid = '', uid = 0, name = '' } = user;
        if (password === psw) {
          return {
            jsonrpc: 2.0,
            id: 1,
            result: { sid, name, uid, status: 'ok' },
          };
        }
      }

      return {
        jsonrpc: 2.0,
        id: 1,
        result: { status: 'error' },
      };
    },
  };
};
