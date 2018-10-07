import service from '@/services/odooService';

import dvaOdoo from '../../../../odoo/dva-odoo';
import dvaOdooCrm from '../../../../odoo/dva-odoo-crm';

const dvaModel = ({ namespace, model, api }) => {
  return {
    namespace,
    state: {},
    effects: {
      *queryBySmallId({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const { id, fields } = payload;
        const domain = [['id', '>=', id ? id : 0]];
        const response = yield api.search(token, {
          model,
          namespace,
          domain,
          fields,
          context: { mock: 'queryBySmallId' },
        });
        const { result, error } = response;
        if (result) {
          yield put({
            type: 'odooData/update',
            payload: { model, data: result },
          });
          const ids = result.map(item => item.id);
          yield put({ type: 'save', payload: { ids } });
        }
      },
    },
    reducers: {},
  };
};

const contact = {
  model: 'res.partner',
  namespace: 'contact',
  //   inherit:   'base',
  //   inherit:   'res.partner',
  inherit: 'res.partner.contact',
  service,
  fields: ['name', 'email'],
  dvaModel,
};

export default dvaOdoo(dvaOdooCrm(contact));
