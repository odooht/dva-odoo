import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

const ss =  dvaOdoo({
  model: 'res.users',
  namespace: 'user',
  inherit: 'res.users',
  service,
  fields:{ default: [
    'name', 'login', 'todo_table_ids','done_table_ids'
  ]}
});




console.log(ss)

export default ss
