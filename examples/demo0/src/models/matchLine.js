import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.match.line',
  namespace: 'matchLine',
  inherit: 'og.match.line',
  service,
  fields:{ default: [
    'name','match_id','deal_id','host_id','guest_id',
    'open_table_id','close_table_id',
    'open_board_id','close_board_id',
    'open_declarer', 'open_contract', 'open_result', 'open_point', 'open_ns_point', 'open_ew_point','host_imp',
    'close_declarer','close_contract','close_result','close_point','close_ns_point','close_ew_point','guest_imp'
  ]}
});
