import ogBoard from './og.board';

const allCreators = {
  'og.board': ogBoard,
};

export default options => {
  const { inherit } = options;
  const creator = allCreators[inherit];
  return creator ? creator(options) : options;
};
