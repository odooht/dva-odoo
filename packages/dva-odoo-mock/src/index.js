import loginModel from './login';

import modelCreators from './models';
import baseModel from './baseModel';

const getBaseOptions = options => {
  const { inherit = 'base' } = options ? options : {};

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

export default ({
  type,
  models = {},
  payload: {
    url,
    params: {
      body: { params },
    },
  },
}) => {
  if (type === 'login') {
    return loginModel(models['login']).login(params);
  }

  const { args, kwargs } = params;
  const { context = {} } = kwargs;
  const { mock_react_api } = context;
  const [model, method] = mock_react_api.split('/');

  const new_options = getBaseOptions(models[model]);
  const { records, extend = [] } = new_options;

  let outModel = baseModel(new_options);
  for (var ext of extend) {
    outModel = { ...outModel, ...ext(new_options) };
  }

  const fn = outModel[method];
  const jsonrpc = { jsonrpc: 2.0, id: 1 };
  return fn
    ? { ...jsonrpc, result: fn(...args, kwargs) }
    : { ...jsonrpc, error: { code: '1111' } };
};
