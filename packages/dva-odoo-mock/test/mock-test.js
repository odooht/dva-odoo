import dvaOdoo from '../src/index';

import basemodel from '../src/models/baseModel';

describe('dva-odoo-mock', () => {
  it('create mock ok', () => {
    create_mock();
  });
});

const create_mock = () => {
  const body = {
    params: {
      model: 'res.partner',
      method: 'read',
      args: [1, ['name']],
      kwargs: {
        context: {
          mock_react_api: 'contact/read',
        },
      },
    },
  };

  const result = dvaOdoo({
    proxy: {},
    request: { url: '/api', params: { body } },
  }).mockApi.jsonApi(body, {});
  const model = basemodel();
  const result2 = model.read(1, []);
  expect(result.result).toEqual(result2);
};
