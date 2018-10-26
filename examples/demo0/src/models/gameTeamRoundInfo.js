import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.game.team.round.info',
  namespace: 'gameTeamRoundInfo',
  inherit: 'og.game.team.round.info',
  service,
  fields:{ default: [
    'name','team_id','game_id','group_id','round_id',
    'match_id',
    'score','score_manual','score_uom'
  ]}
});
