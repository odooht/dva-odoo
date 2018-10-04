const getParams = (payload, mock_default) => {
  const { namespace, context = {} } = payload;
  const { mock = mock_default } = context;
  const mock_react_api = namespace + '/' + mock;
  return { ...payload, context: { ...context, mock_react_api } };
};

const odooApiCreator = odooCall => {
  const search = async (token, params) => {
    const { model, domain, context } = getParams(params, 'search');
    const method = 'search';
    const response = await odooCall(token, {
      model,
      method,
      args: [domain],
      kwargs: { context },
    });
    const { result, error } = response;
    return { result, error };
  };

  const searchRead = async (token, params) => {
    const { model, domain, fields, context } = getParams(params, 'searchRead');
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
    const { model, id, fields, context } = getParams(params, 'read');
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
    const { model, id, vals, context } = getParams(params, 'write');
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

  const create = async (token, params) => {
    const { model, vals, context } = getParams(params, 'create');
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

  const nameCreate = async (token, params) => {
    const { model, name, context } = getParams(params, 'nameCreate');
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

  const unlink = async (token, params) => {
    const { model, id, context } = getParams(params, 'unlink');
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
    searchRead,
    read,
    write,
    create,
    nameCreate,
    unlink,
  };
};

export default call => {
  const api = odooApiCreator(call);
  return api;
};
