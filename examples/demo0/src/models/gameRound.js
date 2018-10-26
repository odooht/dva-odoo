import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.game.round',
  namespace: 'game.round',
  inherit: 'og.game.round',
  service,
  fields:{ default: [
    'name','number','game_id',
    'date_from','date_thru','team_info_ids',
    'deal_ids','match_ids'
  ]}
});
