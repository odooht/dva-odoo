import baseCreator from './dob_base';
import gameCreator from './zog_igame';

// TBD: Mix all models in each addons, same model must call modelExtend
const creatorMixin = {
  ...baseCreator,
  ...gameCreator
}


export default {
  ...creatorMixin
}
