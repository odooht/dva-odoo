/*
  This is a template for mock data.
  The file name is dva model name.
  The method name is same to a param named of mock,
    the mock param be set when a odoo api method called by a dva effect method
*/

import dvaOdoo from 'dva-odoo-mock';

const records = {
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

const extend = {
  searchAll: (domain, kwargs) => {
    const ids = Object.keys(records);
    return str2int(ids);
  },

  queryBySmallId: (domain, kwargs) => {
    const ids0 = Object.keys(records);
    const ids = str2int(ids0);
    const id0 = domain[0][2];
    const res = [];
    for (var id of ids) {
      if (id >= id0) {
        res.push(id);
      }
    }
    return res;
  },

  rename: (id, vals) => {
    const { name = '' } = vals;
    if (id) {
      records[id].name = name;
      return 1;
    } else {
      return 0;
    }
  },
};

export default dvaOdoo.mockModel({ records, model: 'res.partner', extend });
