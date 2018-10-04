import services from '@/services/odooService';

import dvaOdoo from 'dva-odoo';

const contact = {
  service: services.call,
  namespace: 'contact',
  model: 'res.partner',
  inherit: 'res.partner.contact',
  extend: [
    () => {
      return {
        namespace: 'contact',
        state: {},

        effects: {
          *queryBySmallId({ payload }, { call, put, select }) {
            const { id } = payload;
            const domain = [['id', '>=', id]];

            yield put({
              type: 'search',
              payload: { domain, fields: ['name'], context: { mock: 'queryBySmallId' } },
            });
          },

          *rename({ payload }, { call, put, select }) {
            const { id, name } = payload;
            yield put({
              type: 'write',
              payload: { id, vals: { name }, context: { mock: 'rename' } },
            });
          },

          *createByName({ payload }, { call, put, select }) {
            const { name } = payload;
            yield put({ type: 'nameCreate', payload: { name } });
            yield put({ type: 'create', payload: { vals: { name } } });
          },

          *del({ payload }, { call, put, select }) {
            const { id } = payload;
            yield put({ type: 'unlink', payload: { id } });
          },
        },

        reducers: {},
      };
    },
  ],
};

export default dvaOdoo(contact);
