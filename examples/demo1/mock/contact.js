/*
  This is a template for mock data.
  The file name is dva model name.
  The method name is same to a param named of mock,
    the mock param be set when a odoo api method called by a dva effect method
*/

const my_records = {
  1: { id: 1, name: 'c1', email: '' },
  2: { id: 2, name: 'c2', email: '' },
  3: { id: 3, name: 'c3', email: '' },
  4: { id: 4, name: 'c4', email: '' },
};

const str2int = ids => {
  const res = [];
  for (var id of ids) {
    res.push(parseInt(id));
  }
  return res;
};

const creator = ({ records }) => {
  return {
    queryBySmallId: (domain, kwargs) => {
      const ids0 = Object.keys(records);
      const ids = str2int(ids0);
      const id0 = domain[0][2];
      const res = [];
      for (var id of ids) {
        if (id >= id0) {
          res.push(records[id]);
        }
      }
      return res;
    },
  };
};

export default () => {
  return {
    records: my_records,
    inherit: 'res.partner',
    extend: [creator],
  };
};
