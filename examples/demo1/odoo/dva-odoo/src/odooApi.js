const getParams = (payload, mock_default) => {
  const { namespace, context = {} } = payload;
  const { mock = mock_default } = context;
  const mock_react_api = namespace + '/' + mock;
  return { ...payload, context: { ...context, mock_react_api } };
};

const apiCreator = ({ fields: default_fields = ['name'], odooCall }) => {
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
    const { model, domain, fields = default_fields, context } = getParams(params, 'searchRead');
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
    const { model, id, fields = default_fields, context } = getParams(params, 'read');
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

export default ({ fields: default_fields = ['name'], odooCall }) => {
  const api = apiCreator({ fields: default_fields, odooCall });

  const createRead = async (token, params) => {
    const { model, vals, fields = default_fields, namespace } = params;
    const response = await api.create(token, { model, vals, namespace });
    const { result: result0, error: error0 } = response;

    if (result0) {
      const response2 = await api.read(token, {
        model,
        id: result0,
        fields,
        namespace,
      });
      const { result, error } = response2;
      return { result, error };
    }
    return { result: result0, error: error0 };
  };

  const nameCreateRead = async (token, params) => {
    const { model, name, fields = default_fields, namespace } = params;
    const response = await api.nameCreate(token, { model, name, namespace });
    const { result: result0, error: error0 } = response;
    if (result0) {
      const response2 = await api.read(token, {
        model,
        id: result0[0],
        fields,
        namespace,
      });
      const { result, error } = response2;
      return { result, error };
    }
    return { result: result0, error: error0 };
  };

  return {
    ...api,
    createRead,
    nameCreateRead,
  };
};
