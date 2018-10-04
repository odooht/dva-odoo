const my_records = {
  1: { id: 1, name: 'n1' },
  2: { id: 2, name: 'n2' },
  3: { id: 3, name: 'n3' },
};

/*
const str2int = ids => {
  const res = [];
  for (var id of ids) {
    res.push(parseInt(id));
  }
  return res;
};
*/

export default ({ records: records0 }) => {
  const records = records0 ? records0 : my_records;

  const read = (id, fields) => {
    if (typeof id === 'number') {
      return [records[id]];
    }
    let res = [];
    for (var ii of id) {
      res.push(records[ii]);
    }
    return res;
  };

  const search = (domain, kwargs) => {
    return Object.keys(records).map(item => parseInt(item));
    //return str2int(ids);
  };

  const searchRead = (domain, fields) => {
    const ids = search(domain);
    return read(ids, fields);
  };

  const nameCreate = name => {
    const ids1 = Object.keys(records).map(i => parseInt(i));
    const ids = ids1.length ? ids1 : [0];
    const id = Math.max(...ids) + 1;
    records[id] = { id, name };
    return [id, name];
  };

  const create = vals => {
    const ids1 = Object.keys(records).map(i => parseInt(i));
    const ids = ids1.length ? ids1 : [0];
    const id = Math.max(...ids) + 1;
    records[id] = { id, ...vals };
    return id;
  };

  const write = (id, vals) => {
    const rec = { ...records[id] };
    records[id] = { ...rec, ...vals };
    return 1;
  };

  const unlink = id => {
    if (id) {
      delete records[id];
      return 1;
    } else {
      return 0;
    }
  };

  return {
    search,
    read,
    searchRead,
    nameCreate,
    create,
    write,
    unlink,
  };
};
