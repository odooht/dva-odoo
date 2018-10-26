import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.table',
  namespace: 'table',
  inherit: 'og.table',
  service,
  fields:{ default: [
    'name','number','room_type','match_id','game_id','round_id',
    'date_from','date_thru','deal_ids', 'board_ids','board_id',
    'ns_team_id','ew_team_id','table_player_ids','player_ids',
    'east_id','west_id','north_id','south_id',
  ]}
});
