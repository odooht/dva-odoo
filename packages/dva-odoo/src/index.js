import modelExtend from 'dva-model-extend';

import odooDataCreate from './odooData';
import loginCreate from './login';

import odooApi from './odooApi';
import ServiceCreator from './odooService';

import metaModelCreate from './metaModel';
import modelCreators from './addons';

const get_fields = (fields2)=>{
  let fs = {};
  for (const fields of fields2) {
    const { default: deft=[], one2many={}, many2one={}} = fields
    const { default: dft=[], one2many: o2m={}, many2one: m2o={}} = fs
    fs = {
      default: [ ...deft, ...dft ],
      many2one: { ...many2one, ...m2o },
      one2many: { ...one2many, ...o2m }
    }
  }
  
  return { ...fs ,default: Array.from(new Set( fs.default ) ) }
}

const create_normal = ({ options, odooCall }) => {
  const getNewOptions = child => {
    const { inherit } = child;
    const creator = modelCreators[inherit];
    if (creator) {
      const parent = creator(child);
      return getNewOptions(parent);
    } else {
      return metaModelCreate(child);
    }
  };

  const { inherit, namespace,  model: odooModel,
    odooApi, dvaModel, fields: outFields, 
    fields2: outFields2, apis: outApis, extend: outExtend 
  } = options;

  const { model, fields2 = [], apis = [], extend = [] } = getNewOptions({
    inherit, model: odooModel,
    fields2: [...(outFields2 ? outFields2 : []), 
              ...(outFields  ? [outFields]  : [] )],
    apis: [...(outApis ? outApis : []), ...(odooApi ? [odooApi] : [])],
    extend: [...(outExtend ? outExtend : []), ...(dvaModel ? [dvaModel] : [])],
  });
  
  
  const fields = get_fields(fields2)
  
  let api = {};
  for (const apiCreators of apis) {
    const ppp = apiCreators({ model, namespace, fields, odooCall, api });
    api = { ...api, ...ppp };
  }

  let outModel = {};
  for (const dvaModelCreators of extend) {
    outModel = modelExtend(
      outModel,
      dvaModelCreators({ model, namespace, fields, odooCall, api })
    );
  }
  return outModel;
};

export default options => {
  const { inherit } = options;

  if (inherit == 'odooData') {
    return odooDataCreate();
  }

  const { service } = options;
  const odooService = ServiceCreator(service);

  if (inherit == 'login') {
    const dvamodel = loginCreate(odooService);
    const { namespace } = dvamodel;
    const { extend = {} } = options;
    return modelExtend(dvamodel, { ...extend, namespace });
  }

  return create_normal({ options, odooCall: odooService.call });
};
