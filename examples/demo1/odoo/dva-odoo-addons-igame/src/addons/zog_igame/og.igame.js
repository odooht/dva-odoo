export default options => {
  const parent = options => {
    const { namespace } = options;
    return {
      namespace: namespace,

      state: {},

      effects: {},

      reducers: {},
    };
  };

  const { extend = [] } = options;

  return {
    ...options,
    model: 'og.igame',
    inherit: 'base',
    extend: [parent, ...extend],
  };
};
