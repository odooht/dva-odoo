import resCreator from './vob_res';

// TBD: Mix all models in each addons
const allCreators = {
  ...resCreator,
};

export default options => {
  const { inherit } = options;
  const creator = allCreators[inherit];
  return creator ? creator(options) : options;
};
