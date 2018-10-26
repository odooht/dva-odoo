import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.game.team',
  namespace: 'gameTeam',
  inherit: 'og.game.team',
  service,
  fields:{ default: [
    'name','number','game_id','group_id','player_ids',
    'roundinfo_ids',
    'score','score_manual','score_uom'
  ]}
});
