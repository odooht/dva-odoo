import addons from './addons';

export default options => {
  const { inherit = 'base' } = options;

  const create = addons[inherit];

  if (!create) {
    return options;
  }

  return create(options);
};
