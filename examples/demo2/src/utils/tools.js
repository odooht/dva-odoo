export function lookup(ids = [], data = {}) {
  /* get recordset by id or ids  */
  return Array.isArray(ids) ? ids.map(id => data[id]) : data[ids] ? data[ids] : {};
}

export function toArray(field, operator, value) {
  /*
     domain = [['field_name','operator', value], [..., ..., ... ], ... ]
     domain = [toArray('field_name','operator', value), toArray(..., ..., ... ), ... ]
     domain = [['name','like', 'simth'], ['age', '>', 20] ]
     domain = [toArray('name','like', 'simth'), toArray('age', '>', 20) ]
  */
  return [field, operator, value];
}

export function get_ids(id, partners) {
  const ids = [];
  for (var index in partners) {
    /* user-defined */
    if (index > id) {
      ids.push(parseInt(index));
    }
  }
  return ids;
}

export function get_newId(partners) {
  const ids = Object.keys(partners);
  const newids = [0, ...ids];
  const id = Math.max(...newids) + 1;
  return id;
}
