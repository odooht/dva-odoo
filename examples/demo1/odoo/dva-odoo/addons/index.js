// import all model
import baseCreator from './base';

// TBD: Mix all models in each addons, same model must call modelExtend
const creatorMixin = {
  ...baseCreator,
};

export default {
  ...creatorMixin,
};
