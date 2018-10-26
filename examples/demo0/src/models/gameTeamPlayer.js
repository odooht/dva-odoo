import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.game.team.player',
  namespace: 'gameTeamPlayer',
  inherit: 'og.game.team.player',
  service,
  fields:{ default: [
    'name','team_id','role'
  ]}
});
