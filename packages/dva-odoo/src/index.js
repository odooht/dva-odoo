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

export default options => {
  const { inherit = 'base', namespace, service } = options;

  if (inherit == 'odooData') {
    return odooDataCreate({ service });
  }

  if (inherit == 'login') {
    return loginCreate({ service });
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
