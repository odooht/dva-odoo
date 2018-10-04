import modelExtend from 'dva-model-extend';

import odooDataCreate from './odooData';
import loginCreate from './login';

import odooApi from './odooApi';
import ServiceCreator from './odooService';

import metaModelCreate from './metaModel';
import modelCreators from './addons';

const create_normal = options => {
  const getBaseOptions = options => {
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

  const new_options = getBaseOptions({ ...options });

  const srcModel = metaModelCreate(new_options);
  const { extend = [] } = new_options;
  let outModel = srcModel;
  for (var ext of extend) {
    outModel = modelExtend(outModel, ext(new_options));
  }

  return outModel;
};

export default options => {
  const { inherit = 'base' } = options;

  if (inherit == 'odooData') {
    return odooDataCreate();
  }

  const { service } = options;
  const odooService = ServiceCreator(service);

  if (inherit == 'login') {
    const dvamodel = loginCreate(odooService.login);
    const { namespace } = dvamodel;
    const { extend = {} } = options;
    return modelExtend(dvamodel, { ...extend, namespace });
  }

  const api = odooApi(odooService.call);

  return create_normal({ ...options, api, odooCall: odooService.call });
};
