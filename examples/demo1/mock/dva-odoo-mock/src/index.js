//import loginMock from './login';

import modelCreators from './models';
import baseModel from './baseModel';

const getBaseOptions = (options = {}) => {
  const { inherit = 'base' } = options;

  if (inherit === 'base') {
    return options;
  }

  const creator = modelCreators[inherit];

  if (creator) {
    const new_options = creator(options);
    return getBaseOptions(new_options);
  }

  return options;
};

const mockServicesCreator = mockData => {
  const call2 = req => {
    const params = unpack(req);
    const { args, kwargs } = params;
    const { context = {} } = kwargs;
    const { mock_react_api } = context;
    const [model, method] = mock_react_api.split('/');

    const new_options = getBaseOptions(mockData[model]);
    const { records, extend = [] } = new_options;

    let outModel = baseModel(new_options);

    for (var ext of extend) {
      outModel = { ...outModel, ...ext(new_options) };
    }

    const fn = outModel[method];
    const jsonrpc = { jsonrpc: 2.0, id: 1 };

    return { ...jsonrpc, result: fn(...args, kwargs) };
  };

  const login2 = req => {
    //      console.log('login mock,', mockData)
    const { password, login, type } = unpack(req);

    const {
      login: loginUsers = {
        admin: {
          login: 'admin',
          password: '123',
          sid: 'sid1',
          name: 'ss1',
          uid: 1,
        },
      },
    } = mockData;

    //      console.log('login mock,', loginUsers)

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
  };

  const unpack = payload => {
    const { body } = payload;
    const { params } = body;
    return params;
  };

  const call = (req, res) => {
    const result = call2(req);
    res.send(result);
  };

  const login = (req, res) => {
    const result = login2(req);
    res.send(result);
  };

  return { login, call };
};

export default mockServicesCreator;
