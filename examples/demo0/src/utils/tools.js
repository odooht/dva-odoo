export function lookup(ids = [], data = {}) {
  /* get recordset by id or ids  */
  return Array.isArray(ids)
    ? ids.map(id => data[id]).filter(item => item)
    : data[ids]
      ? data[ids]
      : {};
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

