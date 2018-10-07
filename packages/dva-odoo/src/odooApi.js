const apiCreator = options => {
  const {
    model,
    namespace,
    fields: default_fields = ['name'],
    odooCall,
  } = options;

  const getContext = (payload, mock_default) => {
    const { context = {} } = payload;
    const { mock = mock_default } = context;
    const mock_react_api = namespace + '/' + mock;
    return { context: { mock_react_api } };
  };

  const search = async (token, params) => {
    const { context } = getContext(params, 'searchRead');
    const { domain, fields = default_fields } = params;
    const method = 'search_read';
    const response = await odooCall(token, {
      model,
      method,
      args: [domain, fields],
      kwargs: { context },
    });
    const { result, error } = response;
    return { result, error };
  };

  const read = async (token, params) => {
    const { context } = getContext(params, 'read');
    const { id, fields = default_fields } = params;
    const method = 'read';
    const response = await odooCall(token, {
      model,
      method,
      args: [id, fields],
      kwargs: { context },
    });
    const { result, error } = response;
    return { result, error };
  };

  const write = async (token, params) => {
    const { context } = getContext(params, 'write');
    const { id, vals } = params;
    const method = 'write';
    const response = await odooCall(token, {
      model,
      method,
      args: [id, vals],
      kwargs: { context },
    });
    const { result, error } = response;
    return { result, error };
  };

  const _create = async (token, params) => {
    const { context } = getContext(params, 'create');
    const { vals } = params;
    const method = 'create';
    const response = await odooCall(token, {
      model,
      method,
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
      const { fields = default_fields } = params;
      const response2 = await read(token, { id: result0, fields });
      const { result, error } = response2;
      return { result, error };
    }
    return { result: result0, error: error0 };
  };

  const _nameCreate = async (token, params) => {
    const { context } = getContext(params, 'nameCreate');
    const { name } = params;
    const method = 'name_create';
    const response = await odooCall(token, {
      model,
      method,
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
      const { fields = default_fields } = params;
      const response2 = await read(token, { id: result0[0], fields });
      const { result, error } = response2;
      return { result, error };
    }
    return { result: result0, error: error0 };
  };

  const unlink = async (token, params) => {
    const { context } = getContext(params, 'unlink');
    const { id } = params;
    const method = 'unlink';
    const response = await odooCall(token, {
      model,
      method,
      args: [id],
      kwargs: { context },
    });
    const { result, error } = response;
    return { result, error };
  };

  return {
    search,
    read,
    write,
    create,
    nameCreate,
    unlink,
  };
};

export default options => {
  const api = apiCreator(options);
  return { ...api };
};
