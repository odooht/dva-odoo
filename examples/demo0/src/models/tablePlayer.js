import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.table.player',
  namespace: 'tablePlayer',
  inherit: 'og.table.player',
  service,
  fields:{ default: [
    'name','table_id','player_id','position',
    'match_id','team_id',
  ]}
});
