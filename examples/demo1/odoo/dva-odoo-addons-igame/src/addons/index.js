import baseCreator from './vob_res';
//import gameCreator from './zog_igame';

// TBD: Mix all models in each addons
const creatorMixin = {
  ...baseCreator,
  //  ...gameCreator
};

export default {
  ...creatorMixin,
};
