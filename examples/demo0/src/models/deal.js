import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.deal',
  namespace: 'deal',
  inherit: 'og.deal',
  service,
  fields:{ default: [
    'name','number','card_str','game_id','round_id',
    'dealer','vulnerable',
    'card_ids','board_ids'
  ]}
});
