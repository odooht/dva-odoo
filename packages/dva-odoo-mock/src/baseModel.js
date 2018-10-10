const my_records = {
  1: { id: 1, name: 'b1' },
  2: { id: 2, name: 'b2' },
  3: { id: 3, name: 'b3' },
};

const apiCreator = records => {
  const read = (id, fields) => {
    if (typeof id === 'number') {
      return [records[id]];
    }
    return id.map(item => records[item]);
  };

  const search = (domain, kwargs) => {
    return Object.keys(records).map(item => parseInt(item));
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

  const searchRead = (domain, fields) => {
    const ids = search(domain);
    return read(ids, fields);
  };

  const nameCreate = name => {
    const id = create({ name });
    return [id, name];
  };

  return { search, read, create, write, unlink, searchRead, nameCreate };
};

export default ({ records: records0 }) => {
  const records = records0 ? records0 : my_records;
  const api = apiCreator(records);
  return { ...api };
};
