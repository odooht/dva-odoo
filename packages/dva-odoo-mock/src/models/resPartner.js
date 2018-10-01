//import baseModel from './baseModel';

const my_records = {
  1: { id: 1, name: 'n1' },
  2: { id: 2, name: 'n2' },
  3: { id: 3, name: 'n3' },
};

const partner = ({ records }) => {
  return {
    findOrCreate: email => {
      const ids = Object.keys(records);
      const id = Math.max(...ids) + 1;
      records[id] = { id, email };
      return id;
    },
  };
};

export default options => {
  const { records, extend = [] } = options;
  return {
    records: records && Object.keys(records).length ? records : my_records,
    inherit: 'base',
    extend: [partner, ...extend],
  };
};
