//import fetchRequest form '@utils/request'
const fetchRequest = () => {};

export default ({ service, mock, proxy }) => {
  async function mockRequest(url, params) {
    //console.log('request,url,',url, params)
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

  const request = mock ? mockRequest : fetchRequest;

  const login = async params => {
    // TBD jsonrpc  move here

    const { url, db } = service.login;
    const { body } = params;
    const { params: params2 } = body;
    const new_params = {
      ...params,
      body: { ...body, params: { ...params2, db } },
    };

    return await request(url, new_params);
  };

  const call = async (token, params) => {
    // TBD to check token is true

    const { url: url0 } = service.call;
    const now = Date.now();
    const url = `${url0}?session_id=${token}&_now=${now}`;
    return request(url, {
      method: 'POST',
      body: {
        jsonrpc: 2.0,
        id: 1,
        method: 'call',
        params,
      },
    });
  };

  return {
    login,
    call,
    odooCall: call,
  };
};
