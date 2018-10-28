const jsonrpc = params => {
  return {
    method: 'POST',
    body: {
      jsonrpc: 2.0,
      id: 1,
      method: 'call',
      params: params,
    },
  };
};

export default service => {
  const {
    call: { proxy, request },
  } = service;

  async function mockRequest(url, params) {
    const url1 = url.split('?')[0];

    const fn = proxy['POST ' + url1];
    const response = new Promise((resolve, reject) => {
      fn(params, {
        send(data) {
          const { result, error } = data;
          if (result) {
            resolve(data);
          } else {
            reject(data);
          }
        },
      });
    });

    const rslt = await response.then(data => {
      return data;
    });
    //      .catch( (data) => {
    //        console.log('request.result 2,',data)
    //        return data
    //      })

    return rslt;
  }

  const req = proxy ? mockRequest : request;

  const login = async params => {
    const { url, db } = service.login;
    return await req(url, jsonrpc({ ...params, db }));
  };

  const call = async (token, params) => {
    // TBD to check token is true

    const { url: url0 } = service.call;
    const now = Date.now();
    const url = `${url0}?session_id=${token}&_now=${now}`;

    return req(url, jsonrpc(params));
  };

  return {
    login,
    call,
    odooCall: call,
  };
};
