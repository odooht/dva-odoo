import service from '@/services/odooService';

import dvaOdoo from '@/odoo/dva-odoo';
import dvaOdooCrm from '@/odoo/dva-odoo-crm';

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
    ]

}


export default dvaOdoo({
  model: 'res.users',
  namespace: 'resUsers',
  inherit: 'res.users',
  service,
  fields,
});
