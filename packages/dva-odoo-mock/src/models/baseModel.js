const my_records = {
    1: { id: 1, name: 'n1'},
    2: { id: 2, name: 'n2'},
    3: { id: 3, name: 'n3'},
};

const str2int = ( ids ) => {
    const res = [];
    for( var id of ids){
          res.push(parseInt(id) );
    }
    return res
}



export default (records0) => {

const records = records0 ? records0 : my_records;
return {

  searchAll: (domain, kwargs) => {
    const ids = Object.keys(records);
    return str2int( ids );
  },

  read: (id, fields) => {
    if( typeof(id) === 'number' ){
      return [records[id]];
    }
    let res = []
    for (var ii of id) {
      res.push(records[ii])
    }
    return res
  },

  multiRead22: (id, fields) => {
    let res = []
    for (var ii of id) {
      res.push(records[ii])
    }
    return res
  },

  nameCreate: (name) => {
    const ids1 = Object.keys(records).map(i => parseInt(i))
    const ids = ids1.length ? ids1 : [0]
    const id = Math.max(...ids) + 1;
    records[id] = { id, name }
    return [id,name]
  },

  create: (vals) => {
    const {name} = vals;
    const ids1 = Object.keys(records).map(i => parseInt(i))
    const ids = ids1.length ? ids1 : [0]
    const id = Math.max(...ids) + 1;
    records[id] = { id, name }
    return id


  },

  write: (id, vals) => {
    return 1
  },

  unlink: (id) => {
    if (id) {
      delete records[id]
      return 1
    }
    else {
      return 0
    }
  },

}}
