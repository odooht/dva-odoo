import modelExtend from 'dva-model-extend';

import odooDataCreate from './odooData';
import loginCreate from './login';

import odooApi from './odooApi';
import ServiceCreator from './odooService';

import metaModelCreate from './metaModel';
import modelCreators from './addons';

const create_normal = ({ options, odooCall }) => {
  const { inherit, model: odooModel, namespace, odooApi, dvaModel } = options;

  const getNewOptions = ({
    inherit = 'base',
    model,
    apis = [],
    extend = [],
  }) => {
    const creator = modelCreators[inherit];
    if (creator) {
      const {
        model: pModel,
        inherit: pInherit,
        odooApi: pApi,
        dvaModel: pDavModel,
      } = creator;
      const new_apis = pApi ? [pApi] : [];
      const new_extend = pDavModel ? [pDavModel] : [];
      return getNewOptions({
        inherit: pInherit,
        model: model ? model : pModel,
        apis: [...new_apis, ...apis],
        extend: [...new_extend, ...extend],
      });
    } else {
      const { odooApi: BaseApi, dvaModel: baseModel } = metaModelCreate;
      return {
        model,
        apis: [BaseApi, ...apis],
        extend: [baseModel, ...extend],
      };
    }
  };

  const { model, apis = [], extend = [] } = getNewOptions({
    inherit,
    model: odooModel,
    apis: odooApi ? [odooApi] : [],
    extend: dvaModel ? [dvaModel] : [],
  });

  let api = {};
  for (const apiCreators of apis) {
    api = { ...api, ...apiCreators({ model, namespace, odooCall, api }) };
  }

  let outModel = {};
  for (const dvaModelCreators of extend) {
    outModel = modelExtend(
      outModel,
      dvaModelCreators({ model, namespace, api })
    );
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
