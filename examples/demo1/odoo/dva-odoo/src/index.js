import modelExtend from 'dva-model-extend';

import odooDataCreate from './odooData';
import loginCreate from './login';

import odooApi from './odooApi';
import ServiceCreator from './odooService';

import metaModelCreate from './metaModel';
import modelCreators from './addons';

const create_normal = ({ options, odooCall }) => {
  const getNewOptions = child => {
    const { inherit = 'base' } = child;
    const creator = modelCreators[inherit];
    if (creator) {
      const parent = creator(child);
      return getNewOptions(parent);
    } else {
      return metaModelCreate(child);
    }
  };

  const {
    inherit,
    model: odooModel,
    namespace,
    fields,
    odooApi,
    dvaModel, // out model is a leaf model
    apis: outApis = [],
    extend: outExtend = [], // out model is with a parent
  } = options;

  const { model, apis = [], extend = [] } = getNewOptions({
    inherit,
    model: odooModel,
    apis: odooApi ? [...outApis, odooApi] : outApis,
    extend: dvaModel ? [...outExtend, dvaModel] : outExtend,
  });

  let api = {};
  for (const apiCreators of apis) {
    const ppp = apiCreators({ model, namespace, fields, odooCall, api });
    api = { ...api, ...ppp };
  }

  let outModel = {};
  for (const dvaModelCreators of extend) {
    outModel = modelExtend(outModel, dvaModelCreators({ model, namespace, api }));
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
  return create_normal({ options, odooCall: odooService.call });
};
