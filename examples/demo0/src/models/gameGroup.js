import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.game.group',
  namespace: 'gameGroup',
  inherit: 'og.game.group',
  service,
  fields:{ default: [
    'name','game_id','team_ids'
  ]}
});
