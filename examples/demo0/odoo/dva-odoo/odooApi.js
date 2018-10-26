const refCreator = (options) => {
  const {
    model, namespace, fields:out_fields={}, odooCall
  } = options
  const { default: default_fields = ['name'] } = out_fields

  const read = async (token, params) => {
    const mock_react_api = namespace + '/' + 'read';

    const {id, fields = default_fields} = params
    const method = 'read';

    const response = await odooCall(token, {
      model, method,
      args: [id, fields],
      kwargs: { context: { mock_react_api } },
    });
    const { result, error } = response;
    return { result, error };
  };

  return read
}

const apiCreator = (options) => {
  const {
    model, namespace, fields:out_fields={}, odooCall
  } = options

  const {
    default: default_fields = ['name'],
    many2one = {}, one2many = {}
  } = out_fields

  const refs = { ...many2one, ...one2many }

  let reference = {}
  for(const fld in refs ){
    reference[fld] = refCreator( { ...refs[fld], odooCall } )
  }

  const ref_read = async (token, fields, data) => {
    let ref_res = {}


    for (const fld of fields){
      const reference_read = reference[fld]

      const one2many_ids = (data) => {
        //console.log(data)
        const ids0 = data.map( item=> item[fld] ? item[fld] : [])

        //console.log(fld, ids0)

        const ids1 = [].concat.apply([], ids0 )
        //console.log(ids1)
        return Array.from(new Set(ids1))
      }

      const many2one_ids = (data) => {
        const ids0 = data.map( item=> item[fld] ? item[fld][0] : null)
        const ids1 = ids0.filter( item => item != null)
        return Array.from(new Set(ids1))
      }

      const ref_model = ( fld in one2many ) ? one2many[fld].model
                      : ( fld in many2one ) ? many2one[fld].model
                      : null

      const ref_ids = ( fld in one2many ) ? one2many_ids(data)
                    : ( fld in many2one ) ? many2one_ids(data)
                    : []

//      console.log(fld,ref_model,ref_ids)

      if(ref_ids.length){
        const rrr = await reference_read( token ,{ id:ref_ids })
        const {result} = rrr
        if(result){
            ref_res[ref_model]= result
        }
      }
    }

    return ref_res

  }

  const getContext = (payload, mock_default) => {
    const { context = {} } = payload;
    const { mock = mock_default } = context;
    const mock_react_api = namespace + '/' + mock;
    return { context: { mock_react_api } }
  };

  const search = async (token, params) => {
    const { context } = getContext( params, 'searchRead' )
    const {domain, fields = default_fields} = params
    const method = 'search_read';
    const response = await odooCall(token, {
      model, method,
      args: [domain, fields],
      kwargs: { context },
    });
    const { result, error } = response;
    if(result){
        const ref_res = await ref_read(token, fields, result)
        const result2 = {...ref_res, [model]:result}

//        console.log(result,ref_res)

        return {result: result2, error}
    }
    return { result, error };
  };

  const read = async (token, params) => {
    const { context } = getContext( params, 'read' )
    const {id, fields = default_fields} = params
    const method = 'read';
    const response = await odooCall(token, {
      model, method,
      args: [id, fields],
      kwargs: { context },
    });
    const { result, error } = response;

    if(result){
        const ref_res = await ref_read(token, fields, result)
        const result2 = {...ref_res, [model]:result}
        return {result: result2, error}
    }
    return { result, error };
  };

  const write = async (token, params) => {
    const { context } = getContext( params, 'write' )
    const {id, vals} = params
    const method = 'write';
    const response = await odooCall(token, {
      model, method,
      args: [id, vals],
      kwargs: { context },
    });
    const { result, error } = response;
    return { result, error };
  };

  const _create = async (token, params) => {
    const { context } = getContext( params, 'create' )
    const { vals} = params
    const method = 'create';
    const response = await odooCall(token, {
      model, method,
      args: [vals],
      kwargs: { context },
    });
    const { result, error } = response;
    return { result, error };
  };

  const create = async (token, params) => {
    const response = await _create(token, params);
    const { result: result0, error: error0 } = response;
    if (result0) {
      const { fields = default_fields} = params
      const response2 = await read(token, { id: result0, fields });
      const { result, error } = response2;
      return { result, error };
    }
    return { result: result0, error: error0 };
  };

  const _nameCreate = async (token, params) => {
    const { context } = getContext( params, 'nameCreate' )
    const { name} = params
    const method = 'name_create';
    const response = await odooCall(token, {
      model, method,
      args: [name],
      kwargs: { context },
    });
    const { result, error } = response;
    return { result, error };
  };

  const nameCreate = async (token, params) => {
    const response = await _nameCreate(token, params);
    const { result: result0, error: error0 } = response;
    if (result0) {
      const { fields = default_fields} = params
      const response2 = await read(token, { id: result0[0], fields });
      const { result, error } = response2;
      return { result, error };
    }
    return { result: result0, error: error0 };
  };

  const unlink = async (token, params) => {

    const { context } = getContext( params, 'unlink' )
    const { id } = params
    const method = 'unlink';
    const response = await odooCall(token, {
      model, method,
      args: [id],
      kwargs: { context },
    });

    const { result, error } = response;
    return { result, error };
  };


  return {
    reference,
    search,
    read,
    write,
    create,
    nameCreate,
    unlink,
  };
};


export default (options) => {
  const api = apiCreator(options);
  return { ...api  };
};


