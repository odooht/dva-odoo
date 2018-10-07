//import baseModel from './baseModel';

const my_records = {
  1: { id: 1, name: 'n1' },
  2: { id: 2, name: 'n2' },
  3: { id: 3, name: 'n3' },
};

const partner = ({ records }) => {
  const rename = (id, name) => {
    if (Object.keys(records).indexOf(id)) {
      records[id] = { ...records[id], name };
      return 1;
    }
    return 0;
  };

  return {
    rename,
  };
};

export default options => {
  const { records, extend = [] } = options;
  return {
    records: records ? records : my_records,
    inherit: 'res.partner',
    extend: [partner, ...extend],
  };
};
