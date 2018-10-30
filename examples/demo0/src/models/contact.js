import service from '@/services/odooService';

import dvaOdoo from '@/odoo/dva-odoo';
import dvaOdooCrm from '@/odoo/dva-odoo-crm';

const dvaModel = ({ namespace, model, api }) => {
  return {
    namespace,
    state: {},
    effects: {
      *queryBySmallId({ payload }, { call, put, select }) {
        const token = yield select(state => state.login.sid);
        const { id, fields } = payload;
        const domain = [['id', '>=', id ? id : 0]];
        const params = { domain, fields, context: { mock: 'queryBySmallId' } }
        const response = yield api.search(token, params);
        yield put({ type: 'response', payload: {method: 'search', params, response } });
      },
    },
    reducers: {},
  };
};

const fields = {
    default: [
        'name', 'comment',
        'color', 'credit_limit',
        'date', 'image',
        'customer',
        'type',
        'title',
        'child_ids',
        'category_id',
    ],
    many2one: {
        title:{
          model:'res.partner.title',
          namespace:'res.partner.title',
          fields:{default:['name']},
          domain: []
        },

    },

    one2many: {
        child_ids: {
          model: 'res.partner',
          namespace:'contact',
          fields:{default:['name']},
          domain: [],
        },

        category_id:{
          model:'res.partner.category',
          namespace:'res.partner.category',
          fields:{default:['name']},
          domain: [],
        }
    },

}


const contact = {
  model: 'res.partner',
  namespace: 'contact',
  inherit: 'res.partner.contact',
  service,
  fields,
  dvaModel,
};

export default dvaOdoo(dvaOdooCrm(contact));
