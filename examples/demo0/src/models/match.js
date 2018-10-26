import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.match',
  namespace: 'match',
  inherit: 'og.gamatchme',
  service,
  fields:{ default: [
    'name','number','game_id','round_id','group_id',
    'host_id','guest_id','match_team_ids',
    'table_ids','open_table_id','close_table_id',
    'line_ids',
    'host_imp','guest_imp','imp_manual',
    'host_vp','guest_vp','vp_manual'
  ]}
});
