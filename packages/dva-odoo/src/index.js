import modelExtend from 'dva-model-extend';

import odooDataCreate from './odooData';
import loginCreate from './login';
import metaModelCreate from './metaModel';

import modelCreators from './addons';

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

const create_odooData = options => {
  const { service } = options;
  return odooDataCreate({ service });
};

const create_login = options => {
  const { service, extend = {} } = options;

  //  const dvamodel = loginCreate({ service });
  const dvamodel = loginCreate(options);

  console.log(dvamodel);

  const { namespace } = dvamodel;

  return modelExtend(dvamodel, { ...extend, namespace });
};

export default options => {
  const { inherit = 'base' } = options;

  if (inherit == 'odooData') {
    return create_odooData(options);
  }

  if (inherit == 'login') {
    return create_login(options);
  }

  const new_options = getBaseOptions(options);

  const srcModel = metaModelCreate(new_options);

  const { extend = [] } = new_options;

  let outModel = srcModel;
  for (var ext of extend) {
    outModel = modelExtend(outModel, ext(options));
  }

  return outModel;
};
