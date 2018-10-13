/*
  This is a template for mock data.
  The file name is dva model name.
  The method name is same to a param named of mock,
    the mock param be set when a odoo api method called by a dva effect method
*/

const my_records = {
  1: { id: 1, name: 'c1', email: '', title:[1,'t1'], category_id: [1,2] },
  2: { id: 2, name: 'c2', email: '', title:[2,'t1'], category_id: [1,2] },
  3: { id: 3, name: 'c3', email: '', title:[3,'t1'], category_id: [2,3] },
  4: { id: 4, name: 'c4', email: '', title:[1,'t1'], category_id: [3] },
};


const creator = ({ records }) => {
  return {
    queryBySmallId: (domain, kwargs) => {
      const small_id = domain[0][2];

      return Object.keys(records)
        .map(item => parseInt(item))
        .filter(item => item >= small_id)
        .map(item=> records[item])

    },
  };
};

export default () => {
  return {
    records: my_records,
    inherit: 'res.partner.contact',
    extend: [creator],
  };
};
