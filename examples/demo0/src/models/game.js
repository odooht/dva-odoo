import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.game',
  namespace: 'game',
  inherit: 'og.game',
  service,
  fields:{ default: [
    'name','group_ids','round_ids','team_ids','deal_ids'
  ]}
});
